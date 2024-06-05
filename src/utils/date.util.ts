import dayjs from 'dayjs';

export const isBeforeDate = (startDate: Date, endDate: Date): boolean => {
  return dayjs(startDate).isBefore(dayjs(endDate));
};
