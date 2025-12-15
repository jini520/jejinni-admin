// 프로젝트 콘텐츠
export interface ProjectContentDto {
  id: string;
  parentId?: string;
  order?: number;
  content: string;
  children?: string[];
}

export interface ProjectContentRequestDto {
  projectId: string;
  parentId?: string;
  order?: number;
  content: string;
  children?: string[];
}

// 프로젝트 요청 (생성/수정용)
export interface ProjectRequestDto {
  title: string;
  description?: string;
  skills?: string[];
  participants?: number;
  period?: string;
  order?: number;
}

// 프로젝트 상세
export interface ProjectDetailDto {
  id: string;
  title: string;
  description?: string;
  skills?: string[];
  participants?: number;
  period?: string;
  order?: number;
  contents?: ProjectContentDto[];
}

// 프로젝트 목록 아이템
export interface ProjectListItemDto {
  id: string;
  title: string;
  description?: string;
  skills?: string[];
  period?: string;
  order?: number;
}

// 프로젝트 목록 (페이지네이션)
export interface ProjectListDto {
  items: ProjectListItemDto[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
