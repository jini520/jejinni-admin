import axiosInstance from './axios-instance';
import type {
  ApiResponse,
  CategoryDto,
  CategoryRequestDto,
  SkillDto,
  SkillRequestDto,
  SkillsDto,
} from '../@types';

// Skills API
export const skillsApi = {
  // 모든 스킬 조회
  getAllSkills: () =>
    axiosInstance.get<ApiResponse<SkillsDto>>('/api/skills'),

  // 특정 스킬 조회
  getSkill: (id: string) =>
    axiosInstance.get<ApiResponse<SkillDto>>(`/api/skills/${id}`),

  // 스킬 생성
  createSkill: (request: SkillRequestDto) =>
    axiosInstance.post<ApiResponse<SkillDto>>('/api/skills', request),

  // 스킬 수정
  updateSkill: (id: string, request: SkillRequestDto) =>
    axiosInstance.put<ApiResponse<SkillDto>>(`/api/skills/${id}`, request),

  // 스킬 삭제
  deleteSkill: (id: string) =>
    axiosInstance.delete<void>(`/api/skills/${id}`),
};

// Categories API
export const categoriesApi = {
  // 카테고리 목록 조회
  getCategories: () =>
    axiosInstance.get<ApiResponse<CategoryDto[]>>('/api/skills/categories'),

  // 특정 카테고리 조회
  getCategory: (id: string) =>
    axiosInstance.get<ApiResponse<CategoryDto>>(`/api/skills/categories/${id}`),

  // 카테고리 생성
  createCategory: (request: CategoryRequestDto) =>
    axiosInstance.post<ApiResponse<CategoryDto>>('/api/skills/categories', request),

  // 카테고리 수정
  updateCategory: (id: string, request: CategoryRequestDto) =>
    axiosInstance.put<ApiResponse<CategoryDto>>(`/api/skills/categories/${id}`, request),

  // 카테고리 삭제
  deleteCategory: (id: string) =>
    axiosInstance.delete<void>(`/api/skills/categories/${id}`),
};
