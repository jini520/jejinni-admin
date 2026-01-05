// Certification 타입
export interface CertificationDto {
  id: string;
  name: string;
  date: string; // "YY.MM." 형식
  organization?: string;
  tier?: string;
}

export interface CertificationRequestDto {
  name: string;
  date: string; // "YY.MM." 형식
  organization?: string;
  tier?: string;
  orderIndex?: number;
}

// Award 타입
export interface AwardDto {
  id: string;
  name: string;
  date: string; // "YY.MM." 형식
  organization?: string;
  tier?: string;
}

export interface AwardRequestDto {
  name: string;
  date: string; // "YY.MM." 형식
  organization?: string;
  tier?: string;
  orderIndex?: number;
}

// 전체 조회 응답
export interface CertificationsDto {
  certifications: CertificationDto[];
  awards: AwardDto[];
}

