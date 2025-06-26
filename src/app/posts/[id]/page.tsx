// 상세보기 페이지

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import HeroSection from '../components/HeroSection';
import PostMap from '../components/PostMap';
import PinList from '../components/PinList';
import PostItinerary from '../components/PostItinerary';
import CommentSection from '../components/CommentSection';

type Pin = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  category: string;
  images?: string[];      // 이미지 URL 목록
  minCost?: string;
  maxCost?: string;
  currency?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
};


type TravelPostDetail = {
  id: number;
  title: string;
  locationSummary: string;
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

  // 추가된 필드
  useFlight?: boolean;
  flightDepartureAirline?: string;
  flightDepartureName?: string;
  flightDepartureTime?: string;
  flightReturnAirline?: string;
  flightReturnName?: string;
  flightReturnTime?: string;
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

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/journals/public/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        if (data.pins.length > 0) {
          setSelectedPin(data.pins[0]);
        }
      });
  }, [id]);

  if (!post) return <p>로딩 중...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <HeroSection
        title={post.title}
        locationSummary={post.locationSummary}
        dateRange={post.dateRange}
        thumbnailUrl={post.thumbnailUrl}
        authorNickname={post.authorNickname}
        useFlight={post.useFlight}
        flightDepartureAirline={post.flightDepartureAirline}
        flightDepartureName={post.flightDepartureName}
        flightDepartureTime={post.flightDepartureTime}
        flightReturnAirline={post.flightReturnAirline}
        flightReturnName={post.flightReturnName}
        flightReturnTime={post.flightReturnTime}
        travelTrans={post.travelTrans}
        totalBudget={post.totalBudget}
        travelTheme={post.travelTheme}
        review={post.review}
        isAfterTravel={post.isAfterTravel}
      />


      <PostMap
        pins={post.pins}
        selectedPin={selectedPin}
        setSelectedPin={setSelectedPin}
        mapRef={mapRef}
      />

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

      <CommentSection journalId={post.id} />
    </div>
  );
}
