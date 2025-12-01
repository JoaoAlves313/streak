export const getTodayDateString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateStreakStatus = (lastDate: string | null): { isCompletedToday: boolean; isBroken: boolean } => {
  if (!lastDate) return { isCompletedToday: false, isBroken: true };

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (lastDate === today) {
    return { isCompletedToday: true, isBroken: false };
  }

  if (lastDate === yesterday) {
    return { isCompletedToday: false, isBroken: false };
  }

  // If last date is older than yesterday, streak is broken
  return { isCompletedToday: false, isBroken: true };
};