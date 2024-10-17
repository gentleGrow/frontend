export function isDateToday(date: Date | null) {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isSameDate(date1: Date | null, date2: Date | null) {
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function isSameMonth(date1: Date | null, date2: Date | null) {
  if (!date1 || !date2) return false;
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function isGreaterThanTodayDate(date: Date) {
  const today = new Date();

  if (date.getFullYear() > today.getFullYear()) {
    return true;
  }

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() > today.getMonth()
  ) {
    return true;
  }

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() > today.getDate()
  );
}
