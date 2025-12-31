// Career 공통 타입
export interface CareerDto {
  id: string;
  startDate: string; // "YYYY-MM-DD" 형식
  endDate?: string;
  company: string;
  department?: string;
  position?: string;
  skills?: string[];
}

// Business 타입
export interface BusinessDto extends CareerDto {
  details?: string[];
}

export interface BusinessRequestDto {
  startDate: string;
  endDate?: string;
  company: string;
  department?: string;
  position?: string;
  skills?: string[];
  orderIndex?: number;
  details?: string[];
}

// Career Project 타입
export interface CareerProjectDto extends CareerDto {}

export interface CareerProjectRequestDto {
  startDate: string;
  endDate?: string;
  company: string;
  department?: string;
  position?: string;
  skills?: string[];
  orderIndex?: number;
}

// 전체 조회 응답
export interface CareersDto {
  businesses: BusinessDto[];
  projects: CareerProjectDto[];
}

