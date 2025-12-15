import axiosInstance from './axios-instance';
import type {
  ApiResponse,
  ProjectListDto,
  ProjectDetailDto,
  ProjectRequestDto,
  ProjectContentDto,
  ProjectContentRequestDto,
} from '../@types';

// Projects API
export const projectsApi = {
  // 프로젝트 목록 조회 (페이지네이션)
  getProjectList: (page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<ProjectListDto>>('/api/projects', {
      params: { page, size },
    }),

  // 프로젝트 상세 조회
  getProjectDetail: (id: string) =>
    axiosInstance.get<ApiResponse<ProjectDetailDto>>(`/api/projects/${id}`),

  // 프로젝트 생성
  createProject: (request: ProjectRequestDto) =>
    axiosInstance.post<ApiResponse<ProjectDetailDto>>(
      '/api/projects',
      request
    ),

  // 프로젝트 수정
  updateProject: (id: string, request: ProjectRequestDto) =>
    axiosInstance.put<ApiResponse<ProjectDetailDto>>(
      `/api/projects/${id}`,
      request
    ),
};

// Project Contents API
export const projectContentsApi = {
  // 프로젝트 콘텐츠 생성
  createContent: (request: ProjectContentRequestDto) =>
    axiosInstance.post<ApiResponse<ProjectContentDto>>(
      '/api/projects/contents',
      request
    ),

  // 프로젝트 콘텐츠 수정
  updateContent: (id: string, request: ProjectContentRequestDto) =>
    axiosInstance.put<ApiResponse<ProjectContentDto>>(
      `/api/projects/contents/${id}`,
      request
    ),

  // 프로젝트 콘텐츠 삭제
  deleteContent: (id: string) =>
    axiosInstance.delete<void>(`/api/projects/contents/${id}`),
};

