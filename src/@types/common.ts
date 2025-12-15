// 공통 API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

// 페이지네이션 타입 (필요시 사용)
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

