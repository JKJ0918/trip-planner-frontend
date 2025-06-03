// hooks/useJournalSearch.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Journal = {
  id: number;
  title: string;
  thumbnailUrl: string;
  locationSummary: string;
  authorNickname: string;
  createdAt: string;
};

type JournalListResponse = {
  content: Journal[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

export const useJournalSearch = (page: number, size: number, keyword: string) => {
  return useQuery<JournalListResponse>({
    queryKey: ['journals', page, size, keyword] as const,
    queryFn: async () => {
      const response = await axios.get<JournalListResponse>('/api/journals/list', {
        params: { page, size, keyword },
      });
      return response.data;
    },
    placeholderData: () => ({
      content: [],
      totalPages: 0,
      totalElements: 0,
      number: page,
      size,
    }),
  });
};

