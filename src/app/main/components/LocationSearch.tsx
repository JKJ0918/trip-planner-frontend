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
      const matched = locations.find(
        (loc) => loc.name.toLowerCase() === keyword
      );
      setFiltered(matched ? [matched] : []);
    }
  }, [searchKeyword, locations]);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <input
        type="text"
        placeholder="도시 이름을 입력하세요 (예: 하와이)"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
      />

      <ul className="mt-4 bg-white rounded shadow">
        {filtered.map((loc) => (
          <li
            key={loc.id}
            className="p-3 border-b hover:bg-gray-100 cursor-pointer"
            onClick={() => setSelected(loc)}
          >
            <div className="font-bold">{loc.name}</div>
            <div className="text-sm text-gray-500">{loc.country}</div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="p-4 text-center text-gray-400">일치하는 도시가 없습니다.</li>
        )}
      </ul>

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
