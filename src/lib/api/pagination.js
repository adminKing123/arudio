import { PAGINATION_LIMIT } from "@config";

/**
 * @param {Request} request
 * @param {{ defaultLimit?: number, maxLimit?: number }} [options]
 */
export function parsePagination(request, options = {}) {
  const { defaultLimit = PAGINATION_LIMIT, maxLimit = 100 } = options;
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const rawLimit = Number(searchParams.get("limit")) || defaultLimit;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * @param {unknown[]} items
 * @param {{ page: number, limit: number, total: number }} meta
 */
export function paginatedResponse(items, { page, limit, total }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * @param {unknown} id
 */
export function parseId(id) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}
