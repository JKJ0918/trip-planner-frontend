'use client';

import { TravelPostSummary } from '@/app/maps/utils/tripstore';
import Link from 'next/link';

interface Props { post: TravelPostSummary; }

export default function PostCard({ post }: Props) {
  const src = `${post.thumbnailUrl ?? ''}`;

  return (
    <Link href={`/posts/${post.id}`} className="block">
      {/* 카드 자체를 더 크고 묵직하게 */}
      <article className="group h-full overflow-hidden rounded-xl bg-white ring-1 ring-black/5 shadow md:shadow-md hover:shadow-lg hover:ring-black/10 transition-all">
        {/* 썸네일: 가로 100% + 16:9. 더 크고 시원하게 보입니다. */}
        <div className="relative w-full aspect-[4/3] bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover
                       transition-transform duration-300 ease-out
                       group-hover:scale-110 will-change-transform"
          />
        </div>

        {/* 패딩/폰트 키움 */}
        <div className="p-5 md:p-6">
          <h2 className="line-clamp-1 text-xl md:text-xl font-semibold text-gray-900 group-hover:underline">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-xs md:text-sm text-gray-600">
            {post.locationSummary}
          </p>

          <div className="mt-3 md:mt-2 text-xs md:text-xs text-gray-500">
            by {post.authorNickname} · {new Date(post.createdAt).toLocaleDateString()}
            {' · '}좋아요 {post.likeCount} · 조회수 {post.views}
          </div>
        </div>
      </article>
    </Link>
  );
}
