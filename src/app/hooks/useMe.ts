"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (!r.ok) throw new Error("failed");
    return r.json();
  });

export type Me = { id: number; nickname: string; email: string };

export function useMe() {
  const { data, error, isLoading, mutate } = useSWR<Me>(
    `${process.env.NEXT_PUBLIC_API_BASE}/auth/me`,
    fetcher
  );
  return { me: data, error, isLoading, refresh: mutate };
}
