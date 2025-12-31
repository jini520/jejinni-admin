import axiosInstance from './axios-instance';
import type {
  ApiResponse,
  CareersDto,
  BusinessDto,
  BusinessRequestDto,
  CareerProjectDto,
  CareerProjectRequestDto,
} from '../@types';

// Careers API
export const careersApi = {
  // 전체 조회
  getAllCareers: () =>
    axiosInstance.get<ApiResponse<CareersDto>>('/api/careers'),
};

// Business API
export const businessApi = {
  // Business 생성
  createBusiness: (request: BusinessRequestDto) =>
    axiosInstance.post<ApiResponse<BusinessDto>>('/api/careers/business', request),

  // Business 조회
  getBusinessById: (id: string) =>
    axiosInstance.get<ApiResponse<BusinessDto>>(`/api/careers/business/${id}`),

  // Business 수정
  updateBusiness: (id: string, request: BusinessRequestDto) =>
    axiosInstance.put<ApiResponse<BusinessDto>>(`/api/careers/business/${id}`, request),

  // Business 삭제
  deleteBusiness: (id: string) =>
    axiosInstance.delete<void>(`/api/careers/business/${id}`),
};

// Career Project API
export const careerProjectApi = {
  // Career Project 생성
  createCareerProject: (request: CareerProjectRequestDto) =>
    axiosInstance.post<ApiResponse<CareerProjectDto>>('/api/careers/projects', request),

  // Career Project 조회
  getCareerProjectById: (id: string) =>
    axiosInstance.get<ApiResponse<CareerProjectDto>>(`/api/careers/projects/${id}`),

  // Career Project 수정
  updateCareerProject: (id: string, request: CareerProjectRequestDto) =>
    axiosInstance.put<ApiResponse<CareerProjectDto>>(`/api/careers/projects/${id}`, request),

  // Career Project 삭제
  deleteCareerProject: (id: string) =>
    axiosInstance.delete<void>(`/api/careers/projects/${id}`),
};

