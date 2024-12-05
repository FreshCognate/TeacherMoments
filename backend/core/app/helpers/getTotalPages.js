export default function (count, paginationAmount = 20) {

  return Math.ceil(count / paginationAmount) || 1;

};