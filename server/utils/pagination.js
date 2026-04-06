const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const parsePagination = (query = {}, defaults = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || defaults.page || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(query.limit, 10) || defaults.limit || DEFAULT_LIMIT, 1),
    defaults.maxLimit || MAX_LIMIT
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const createPaginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
  hasNextPage: page * limit < total,
  hasPreviousPage: page > 1,
});

module.exports = {
  createPaginationMeta,
  parsePagination,
};
