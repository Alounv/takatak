import { z } from "zod";

export const getIsTheSameDay = (date1: Date, date2: Date) => {
  if (!date1 || !date2) return false;
  z.date().parse(date1);
  z.date().parse(date2);
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getIsToday = (date: Date) => {
  const now = new Date();
  return getIsTheSameDay(date, now);
};

export const getIsYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getIsTheSameDay(date, yesterday);
};
