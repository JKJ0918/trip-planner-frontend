'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TravelInfo from './components/TravelInfo';
import PinListPanel from './components/PinListPanel';

const MyMap = dynamic(() => import('./components/MyMap'), { ssr: false });

export default function FullMapPage() {
  const [activeTab, setActiveTab] = useState<null | '여행 일정' | '방문지' | '상세 일정'>(null);

  const toggleTab = (tab: typeof activeTab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* 좌측 아이콘 사이드바 */}
      <div className="flex h-full w-16 flex-col justify-between border-e border-gray-100 bg-white">
        <div className="px-2 py-4 space-y-4">
          <button
            onClick={() => toggleTab('여행 일정')}
            className={`group relative flex justify-center rounded-sm px-2 py-1.5 ${
              activeTab === '여행 일정' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              여행 일정
            </span>
          </button>

          <button
            onClick={() => toggleTab('방문지')}
            className={`group relative flex justify-center rounded-sm px-2 py-1.5 ${
              activeTab === '방문지' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <svg
              className="size-6 sm:size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              방문지
            </span>
          </button>

          <button
            onClick={() => toggleTab('상세 일정')}
            className={`group relative flex justify-center rounded-sm px-2 py-1.5 ${
              activeTab === '상세 일정' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
              <svg
              className="size-6 sm:size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              상세 일정
            </span>
          </button>

        </div>

      </div>

      {/* 우측 메뉴 (조건부 렌더링) */}
      {activeTab && (
        <div className="w-100 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 capitalize text-blue-600">{activeTab}</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {activeTab === '여행 일정' && (
              <>
              <TravelInfo />
              
              </>
            )}
            {activeTab === '방문지' && (
              <>
              <PinListPanel />
              </>
            )}
            {activeTab === '상세 일정' && (
              <>
                <li>Plans</li>
                <li>Payment History</li>
              </>
            )}

          </ul>
        </div>
      )}

      {/* 지도 본체 */}
      <div className="flex-1">
        <MyMap />
      </div>
    </div>
  );
}
