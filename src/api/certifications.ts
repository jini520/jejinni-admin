import axiosInstance from './axios-instance';
import type {
  ApiResponse,
  CertificationsDto,
  CertificationDto,
  CertificationRequestDto,
  AwardDto,
  AwardRequestDto,
} from '../@types';

// Certifications API
export const certificationsApi = {
  // 전체 조회
  getAllCertifications: () =>
    axiosInstance.get<ApiResponse<CertificationsDto>>('/api/certifications'),
};

// Certification API
export const certificationApi = {
  // Certification 생성
  createCertification: (request: CertificationRequestDto) =>
    axiosInstance.post<ApiResponse<CertificationDto>>(
      '/api/certifications/certifications',
      request
    ),

  // Certification 조회
  getCertificationById: (id: string) =>
    axiosInstance.get<ApiResponse<CertificationDto>>(
      `/api/certifications/certifications/${id}`
    ),

  // Certification 수정
  updateCertification: (id: string, request: CertificationRequestDto) =>
    axiosInstance.put<ApiResponse<CertificationDto>>(
      `/api/certifications/certifications/${id}`,
      request
    ),

  // Certification 삭제
  deleteCertification: (id: string) =>
    axiosInstance.delete<void>(`/api/certifications/certifications/${id}`),
};

// Award API
export const awardApi = {
  // Award 생성
  createAward: (request: AwardRequestDto) =>
    axiosInstance.post<ApiResponse<AwardDto>>('/api/certifications/awards', request),

  // Award 조회
  getAwardById: (id: string) =>
    axiosInstance.get<ApiResponse<AwardDto>>(`/api/certifications/awards/${id}`),

  // Award 수정
  updateAward: (id: string, request: AwardRequestDto) =>
    axiosInstance.put<ApiResponse<AwardDto>>(
      `/api/certifications/awards/${id}`,
      request
    ),

  // Award 삭제
  deleteAward: (id: string) =>
    axiosInstance.delete<void>(`/api/certifications/awards/${id}`),
};

