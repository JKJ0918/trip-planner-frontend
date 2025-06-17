import { useEffect, useState } from 'react';
import { Location } from '../types/location';
import LocationModal from './LocationModal';

export default function LocationSearch() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtered, setFiltered] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch('http://localhost:8080/api/locations');
      const data = await res.json();
      setLocations(data);
      setFiltered(data);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword === '') {
      setFiltered(locations);
    } else {
      const matched = locations.filter((loc) =>
        loc.name.toLowerCase().includes(keyword)
      );
      setFiltered(matched);
    }
  }, [searchKeyword, locations]);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* 검색창 */}
      <div className="mx-auto mb-10" style={{ maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="도시 이름을 입력하세요 (예: 하와이)"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 ">
        {filtered.map((loc) => (
          <div
            key={loc.id}
            onClick={() => setSelected(loc)}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-xl hover:scale-105 overflow-hidden transition"
          >
            <img
              src={loc.imageUrl}
              alt={loc.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-1">{loc.name}</h3>
              <p className="text-sm text-gray-500">{loc.country}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ✨ 모달 띄우기 */}
      {selected && (
        <LocationModal
          location={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
