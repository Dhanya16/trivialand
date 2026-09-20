import {
  buildPaginatedResponse,
  parsePagination,
} from '../../src/common/utils/pagination.util';

describe('pagination.util', () => {
  it('parses page and limit with defaults', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('caps limit at maxLimit', () => {
    expect(parsePagination({ page: 2, limit: 100 }, 50)).toEqual({
      page: 2,
      limit: 50,
      skip: 50,
    });
  });

  it('builds paginated response metadata', () => {
    const response = buildPaginatedResponse(['a', 'b'], 1, 10, 2);

    expect(response).toEqual({
      data: ['a', 'b'],
      meta: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        nextCursor: null,
      },
    });
  });
});
