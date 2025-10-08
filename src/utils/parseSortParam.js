import {
  DEFAULT_PAGINATION_VALUES,
  SORT_ORDER,
  SORT_FIELD,
} from '../constants/pagination.js';

const parseSortBy = (sortBy) => {
  if (SORT_FIELD.includes(sortBy)) {
    return sortBy;
  }
  return DEFAULT_PAGINATION_VALUES.sortBy;
};

const parseSortOrder = (sortOrder) => {
  if (SORT_ORDER.includes(sortOrder)) {
    return sortOrder;
  }
  return DEFAULT_PAGINATION_VALUES.sortOrder;
};

export const parseSortParam = (query) => {
  const sortBy = parseSortBy(query.sortBy);
  const sortOrder = parseSortOrder(query.sortOrder);
  return {
    sortBy,
    sortOrder,
  };
};
