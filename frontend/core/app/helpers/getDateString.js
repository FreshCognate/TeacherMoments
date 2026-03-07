import dayjs from 'dayjs';

const getDateString = (date) => {
  return dayjs(date).format('MMM D, YYYY');
};

export default getDateString;
