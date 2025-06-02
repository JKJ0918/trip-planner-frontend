'use client'

import { useTripStore } from "../utils/tripstore";


export default function TravelInfo() {
    const { travelMainEntry, setTravelMainEntry } = useTripStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTravelMainEntry({ [name]: value });
    };

    const { isPublic, setIsPublic } = useTripStore();

    
    return (
        <div className="space-y-4 p-4 border rounded shadow bg-white">
        <div>
            <label className="block text-sm font-medium text-gray-700">제목</label>
            <input
            type="text"
            name="title"
            value={travelMainEntry.title}
            onChange={handleChange}
            placeholder="예: 호주 여행기"
            className="mt-1 block w-full rounded border px-3 py-2"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">여행 도시</label>
            <input
            type="text"
            name="locationSummary"
            value={travelMainEntry.locationSummary}
            onChange={handleChange}
            placeholder="예: 시드니, 멜버른"
            className="mt-1 block w-full rounded border px-3 py-2"
            />
        </div>
        <div className="flex items-center space-x-2">
        <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublic" className="text-sm text-gray-700">
            이 여행 계획을 게시판에 공개합니다
        </label>
        </div>
        </div>
    );
    }