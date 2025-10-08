export const calculatePagination = (total, page, perPage) => {
  const totalData = total;
  const totalPage = Math.ceil(totalData / perPage);
  const hasNextPage = page < totalPage;
  const hasPreviousPage = page > 1;
  return {
    page,
    perPage,
    totalData,
    totalPage,
    hasNextPage,
    hasPreviousPage,
  };
};
