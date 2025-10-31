// lib/stomp.ts

import { Client, IMessage, StompHeaders, StompSubscription } from "@stomp/stompjs";

// 전역 단일 Client
let client: Client | null = null;

// 구독 기록
type SubRecord = {
  destination: string;
  handler: (payload: any, raw: IMessage) => void;
  subscription?: StompSubscription; // 생략가능한 속성( + 나중에 들어올수도있음)
};
const subscriptions: SubRecord[] = [];

// 운영은 wss://your-domain/ws-stomp 권장
const WS_URL = process.env.NEXT_PUBLIC_WS_URL_WS || "wss://tripplanner-backend-v1.onrender.com/ws-stomp";
// const WS_URL = process.env.NEXT_PUBLIC_WS_URL_WS || "ws://localhost:8080/ws-stomp";
// (1) 현재 클라이언트 얻기 (디버깅용)
export function getStompClient() {
  return client;
}

export async function ensureConnected(connectHeaders?: StompHeaders): Promise<void> {
  // SSR(서버)에서는 아무것도 하지 않음
  if (typeof window === 'undefined') { return; }

  // 이미 연결됨
  if (client?.connected) { return; }



    // STOMP Client 생성
    client = new Client({
      /*
      webSocketFactory: () => {
        // 쿠키 인증을 쓰면 withCredentials를 true로
        //const sock = new SockJSCtor(WS_URL, null, { withCredentials: true });
        const sock = new SockJS(WS_URL);
        return sock as any;
      },
      */
      webSocketFactory: () => new WebSocket(WS_URL), // 웹소켓 연결을 생성하는 역할 하는 팩토리 함수

      connectHeaders: connectHeaders ?? {},
      reconnectDelay: 2000,  // 자동 재연결 주기(ms), 연결이 정상적으로 유지되는 동안에는 동작안함
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log("[STOMP] onConnect");
        // 끊겼다가 살아나도, 기존 구독을 모두 복원
        subscriptions.forEach((s) => {
          try { s.subscription?.unsubscribe(); } catch {} // 중복 방지를 위한 기존 연결 제거
          s.subscription = client!.subscribe(s.destination, (frame) => { // STOMP 서버 구독 요청
            let payload: any = frame.body;
            try { payload = JSON.parse(frame.body); } catch {}
            s.handler(payload, frame);
          });
        });
      },
      
      onWebSocketClose: (ev) => {
        console.warn("[STOMP] WebSocket closed", ev?.code, ev?.reason);
      },

      onWebSocketError: (e) => {
        console.warn("[STOMP] WebSocket error", e);
      },

      onStompError: (f) => {
        console.warn("[STOMP] broker error:", f.body);
      },

    });
    
    client.activate();

}

// 구독: 연결된 상태에서만 호출할 것.
// 반환값은 "구독 해제" 함수.
export function subscribe(
  destination: string,
  handler: (payload: any, raw: IMessage) => void // raw: IMessage 는 필요할 때 사용할 것
  ) : () => void {
  const record: SubRecord = { destination, handler };
  subscriptions.push(record);
  
  if (client?.connected) {
    record.subscription = client.subscribe(destination, (frame) => { // 구독 함수
      let payload: any = frame.body;
      try { payload = JSON.parse(frame.body); } catch {}
      handler(payload, frame); // const unsub = subscribe(dest, (payload: any))... 에서준 payload 호출
      // payload만 줘도되는데 가끔 frame 필요한 경우가 있어 같이 보냄
    });
  }

  // 구독 해제 함수를 반환 (해제 하는게 아님)
  return () => {
    try { record.subscription?.unsubscribe(); } catch {} // 구독이 끊어짐
    const idx = subscriptions.indexOf(record); // 
    if (idx >= 0) subscriptions.splice(idx, 1);
  };

  }

// 메시지 발행 (서버로 보내기)
export function publish(destination: string, body: unknown, headers?: StompHeaders) {
  if (!client || !client.connected) {
    console.warn("[STOMP] publish skipped (not connected):", destination);
    return;
  }
  client.publish({
    destination,
    body: JSON.stringify(body), // roomId, content, avatarUrl 가 들어감
    headers: headers ?? {},
  });
}



