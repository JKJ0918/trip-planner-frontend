// lib/stomp.ts

import { Client, IMessage, StompHeaders, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// 브라우저에서만 동적 로드할 SockJS 생성자 보관
let SockJSCtor: any | null = null;

// 전역 단일 Client
let client: Client | null = null;

// 동시에 여러 번 호출돼도 연결 1번만 일어나도록
let isConnecting = false;
let connectPromise: Promise<void> | null = null;

// 구독 기록
type SubRecord = {
  destination: string;
  handler: (payload: any, raw: IMessage) => void;
  subscription?: StompSubscription;
};
const subscriptions: SubRecord[] = [];

// 운영은 wss://your-domain/ws-stomp 권장
const WS_URL = process.env.NEXT_PUBLIC_WS_URL_WS || "ws://localhost:8080/ws-stomp";

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
      webSocketFactory: () => new WebSocket(WS_URL),

      connectHeaders: connectHeaders ?? {},
      reconnectDelay: 2000,  // 자동 재연결 주기(ms), 연결이 정상적으로 유지되는 동안에는 동작안함
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log("[STOMP] onConnect");
        // 끊겼다가 살아나도, 기존 구독을 모두 복원
        subscriptions.forEach((s) => {
          try { s.subscription?.unsubscribe(); } catch {}
          s.subscription = client!.subscribe(s.destination, (frame) => {
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
  destination: string, handler: (payload: any, raw: IMessage) => void
) : () => void{
  const record: SubRecord = { destination, handler };
  subscriptions.push(record);
  
  if (client?.connected) {
    record.subscription = client.subscribe(destination, (frame) => {
      let payload: any = frame.body;
      try { payload = JSON.parse(frame.body); } catch {}
      handler(payload, frame);
    });
  }

  // 구독 해제 함수
  return () => {
    try { record.subscription?.unsubscribe(); } catch {}
    const idx = subscriptions.indexOf(record);
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
    body: JSON.stringify(body),
    headers: headers ?? {},
  });
}



