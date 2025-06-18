// utils/dateUtils.ts
export function generateDateRange(start: Date, end: Date): string[] {
  const result: string[] = [];

  const current = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const adjustedEnd = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate() + 1 // end 포함
  );

  while (current < adjustedEnd) {
    const y = current.getFullYear();
    const m = (current.getMonth() + 1).toString().padStart(2, '0');
    const d = current.getDate().toString().padStart(2, '0');

    result.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }

  return result;
}