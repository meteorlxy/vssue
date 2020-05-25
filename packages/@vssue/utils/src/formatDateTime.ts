import format from 'date-fns/format';

export const formatDateTime = (str: string): string => {
  const dateTime = format(str, 'YYYY-MM-DD HH:mm:ss');
  return dateTime;
};
