// 상세보기 페이지

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import HeroSection from '../components/HeroSection';
import PostMap from '../components/PostMap';
import PinList from '../components/PinList';
import PostItinerary from '../components/PostItinerary';
import CommentSection from '../components/CommentSection';
import PinSidePanel from '../components/PinSidePanel';



type Pin = {
  lat: number; // 위도
  lng: number; // 경도
  name: string; // 위치명
  address: string; // 주소
  category: string; // 카테고리
  images?: string[]; // 이미지 URL 목록
  minCost?: string; // 금액(최소)
  maxCost?: string; // 금액(최대)
  currency?: string; // 화폐 단위
  openTime?: string; // 오픈시간
  closeTime?: string; // 마감시간
  description?: string; // 설명
};


type TravelPostDetail = {
  id: number;
  title: string;
  locationSummary: string;
  description: string;
  dateRange: { startDate: string; endDate: string };
  thumbnailUrl: string;
  authorNickname: string;
  pins: Pin[];
  itinerary: {
    day: number;
    title: string;
    content: string;
    images: string[];
    date: string;
  }[];

  // 추가된 필드 2
  likeCount: number;     // 좋아요 수
  likedByMe: boolean;    // 내가 좋아요 눌렀는지


  // 추가된 필드 1
  useFlight?: boolean;
  flightDepartureAirline?: string;
  flightDepartureName?: string;
  flightDepartureTime?: string;
  flightDepartureAirport?: string;
  flightArrivalAirport?: string;
  flightReturnAirline?: string;
  flightReturnName?: string;
  flightReturnTime?: string;
  flightReturnDepartureAirport?: string;
  flightReturnArrivalAirport?: string;
  travelTrans?: string;
  totalBudget?: string;
  travelTheme?: string;
  review?: string;
  isAfterTravel?: boolean;
};


export default function TravelPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<TravelPostDetail | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: number; nickname: string } | null>(null); // 닉네임 체크

  const [liking, setLiking] = useState(false); // 중복 클릭 방지_좋아요
  const API_BASE = "http://localhost:8080/api/journals";


  const toggleLike = async () => {
    if (!post) return;

    // 비로그인 처리: currentUser 없으면 안내하거나 로그인 페이지로 이동
    if (!currentUser) {
      alert("로그인 후 이용 가능합니다.");
      // router.push("/login"); // 필요시 활성화
      return;
    }

    // 낙관적 업데이트 준비
    const prev = post;
    const optimistic: TravelPostDetail = {
      ...post,
      likedByMe: !post.likedByMe,
      likeCount: post.likedByMe ? Math.max(0, post.likeCount - 1) : post.likeCount + 1,
    };

    try {
      setLiking(true);
      setPost(optimistic);

      const url = `${API_BASE}/${post.id}/like`;
      const res = await fetch(url, {
        method: post.likedByMe ? "DELETE" : "PUT",
        credentials: "include",
      });

      if (!res.ok) {
        // 실패 시 롤백
        setPost(prev);
        const text = await res.text();
        throw new Error(text || "좋아요 처리 실패");
      }
    } catch (e) {
      console.error(e);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setLiking(false);
    }
  };


  const goEdit = () => { // 수정 페이지 이동
    if (!post) return;
    router.push(`/posts/edit/${post.id}`);
  };

  useEffect(() => {
  if (!id) return;

  fetch(`http://localhost:8080/api/journals/public/${id}`, {
    credentials: "include", // 쿠키 같이 보냄
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("게시글 불러오기 실패");
      }
      return res.json();
    })
    .then(data => {
      setPost(data);
      if (data.pins.length > 0) {
        setSelectedPin(data.pins[0]);
      }
    })
    .catch(err => {
      console.error(err);
    });
}, [id]);

useEffect(() => {
  const loadMe = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/journals/auth/me', {
        credentials: 'include',
      });
      const text = await res.text();
      console.log('[auth/me] status:', res.status, 'body:', text);

      if (!res.ok) {
        setCurrentUser(null);
        return;
      }
      const me = JSON.parse(text); // { id, nickname }
      setCurrentUser(me);
    } catch (e) {
      console.error('[auth/me] error:', e);
      setCurrentUser(null);
    }
  };
  loadMe();
}, []);



  if (!post) return <p>로딩 중...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <HeroSection
        title={post.title}
        locationSummary={post.locationSummary}
        description={post.description}
        dateRange={post.dateRange}
        thumbnailUrl={post.thumbnailUrl}
        authorNickname={post.authorNickname}
        useFlight={post.useFlight}
        flightDepartureAirline={post.flightDepartureAirline}
        flightDepartureName={post.flightDepartureName}
        flightDepartureTime={post.flightDepartureTime}
        flightDepartureAirport={post.flightDepartureAirport}
        flightArrivalAirport={post.flightArrivalAirport}
        flightReturnAirline={post.flightReturnAirline}
        flightReturnName={post.flightReturnName}
        flightReturnTime={post.flightReturnTime}
        flightReturnDepartureAirport={post.flightReturnDepartureAirport}
        flightReturnArrivalAirport={post.flightReturnArrivalAirport}
        travelTrans={post.travelTrans}
        totalBudget={post.totalBudget}
        travelTheme={post.travelTheme}
        review={post.review}
        isAfterTravel={post.isAfterTravel}
      />



      {/* 2-단 그리드: 지도(좌) + 패널(우) */}
      <h3 className="text-xl font-semibold mb-3 pb-2 py-4">지도 정보</h3>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      
      <PostMap
        pins={post.pins}
        selectedPin={selectedPin}
        setSelectedPin={setSelectedPin}
        mapRef={mapRef}
      />

      {/* 패널 – 선택된 핀이 있을 때만 */}
      {selectedPin && (
        <PinSidePanel pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}

      </div>


      <PinList
        pins={post.pins}
        onSelect={setSelectedPin}
        mapRef={mapRef}
      />

      <PostItinerary
        itinerary={post.itinerary}
        startDate={post.dateRange.startDate}
        endDate={post.dateRange.endDate}
      />

      <h3 className="text-xl font-semibold mb-3 pb-2 py-4">참고 사항</h3>

      <div className="px-6 py-10 mt-10 bg-gray-0 rounded-xl border border-gray-200 space-y-8">
      {/* 섹션 제목 */}
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">여행 전 꼭 확인하세요</h2>

      {/* 여권/비자 안내 */}
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-2">● 여권/비자 안내</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>◈ 여권은 반드시 복수여권으로 6개월 이상의 유효기간이 남아 있어야 하며 90일간 무비자로 체류 가능합니다.(일부국가 제외)</li>
          <li>◈ 외국인의 경우 대사관에 반드시 확인바랍니다.</li>
          <li>◈ 만 18세 이하 미성년자가 유럽 여행 시에는 부모 동반 여부에 따라 필요한 서류가 다르니 사전에 반드시 준비하세요.</li>
          <li className="text-red-600 mt-2">※ 여권/비자의 경우 경미한 훼손이라도 출입국 시 불이익을 받을 수 있으니 미리 확인해주세요.</li>
        </ul>
      </div>

      {/* 여행 시 주의사항 */}
      <div>
        <h3 className="text-lg font-semibold text-orange-600 mb-2">● 여행 시 주의사항</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>공항에서는 액체, 젤류, 에어로졸은 100ml 이하만 기내 반입이 가능합니다.</li>
          <li>EU 국가에서 환승 시 면세품 포장 개봉 금지 (압수될 수 있음)</li>
          <li>축산물, 식물류 반입 시 검역 필수 – 위반 시 최대 1,000만 원 과태료</li>
          <li>가축 전염병 발생국 방문자는 검역본부에 신고 후 소독 필수</li>
        </ul>
      </div>

      {/* 비상 연락처 */}
      <div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">● 비상 연락처</h3>
        <p className="text-sm text-gray-700 mb-2">
          상품 관련 문의는 예약처 또는 고객센터(1544-5252)로, 아래는 공항 관련 비상 연락처입니다.
        </p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>인천공항 안내: 032-743-3700 (05:00~23:00)</li>
          <li>김해공항 안내: 051-832-0701</li>
          <li>대구: 053-214-0027 / 청주: 043-902-0080 / 무안: 061-941-9810</li>
        </ul>
      </div>
    </div>

    {/* 좋아요 */}
    <div className="flex items-center justify-between border rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLike}
          disabled={liking}
          className={`text-2xl transition-transform ${
            liking ? "scale-95 opacity-70" : "hover:scale-110"
          }`}
          title={post.likedByMe ? "좋아요 취소" : "좋아요"}
          aria-pressed={post.likedByMe}
        >
          {post.likedByMe ? "❤️" : "🤍"}
        </button>
        <span className="text-sm text-gray-700">
          {post.likeCount.toLocaleString()}명이 좋아합니다
        </span>
      </div>
    </div>


    {currentUser?.nickname === post.authorNickname && (
      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/posts/edit/${post.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          수정
        </button>
      </div>
    )}

      <CommentSection journalId={post.id} />
    </div>
  );
}
