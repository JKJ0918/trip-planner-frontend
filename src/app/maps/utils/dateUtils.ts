// utils/dateUtils.ts
export const generateDateRange = (start: Date, end: Date): string[] => {
  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    dates.push(dateStr);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};
