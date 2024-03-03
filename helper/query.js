function queryHelper() {
  function sanitizeQuery(data) {
    // pagination is moved to forms.service
    const { limit, afterDate, beforeDate, offset, status, includeEditLink, sort } = data;
    const newQuery = {};

    // if (limit) newQuery.limit = limit;
    if (afterDate) newQuery.afterDate = afterDate;
    if (beforeDate) newQuery.beforeDate = beforeDate;
    // if (offset) newQuery.offset = offset;
    if (status) newQuery.status = status;
    if (includeEditLink) newQuery.includeEditLink = includeEditLink;
    if (sort) newQuery.sort = sort;

    return newQuery;
  } 

  return {
    sanitizeQuery,
  };
}

module.exports = queryHelper();
