export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
