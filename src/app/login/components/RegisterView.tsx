"use client";

import { useMe } from "@/app/hooks/useMe";
import { useRegisterView } from "@/app/hooks/useRegisterView";




export default function RegisterView({ postId }: { postId: number }) {
  const { me, isLoading } = useMe();
  const enabled = !!me && !isLoading; // 로그인 사용자만 조회수 반영

  useRegisterView(postId, enabled);
  return null; // 화면에 보일 내용은 없음(사이드 이펙트 전용)
}
