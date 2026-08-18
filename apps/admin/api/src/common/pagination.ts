export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginate<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

export function getSkipTake(params: PaginationParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
