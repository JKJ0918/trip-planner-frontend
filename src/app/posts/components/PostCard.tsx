// 게시글 리스트
'use client';


import { TravelPostSummary } from '@/app/maps/utils/tripstore';
import Link from 'next/link';

interface Props {
  post: TravelPostSummary;
}
const BASE_URL = "http://localhost:8080";


export default function PostCard({ post }: Props) {
  console.log(post.thumbnailUrl);
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="flex border rounded-lg shadow-sm hover:shadow-md cursor-pointer bg-white overflow-hidden">
        
        <img
          src={`${BASE_URL}${post.thumbnailUrl}`} // 예: http://localhost:8080/uploads/abc.jpg
          alt="thumbnail"
          className="w-32 h-32 object-cover"
        />
        <div className="p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.locationSummary}</p>
          </div>
          <div className="text-xs text-gray-500">
            by {post.authorNickname} · {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}