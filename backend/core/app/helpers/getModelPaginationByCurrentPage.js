export default function (currentPage, options, paginationAmount = 20) {

  options.skip = (currentPage - 1) * paginationAmount;
  options.limit = paginationAmount;

};