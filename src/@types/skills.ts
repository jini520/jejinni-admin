// Category 타입
export interface CategoryDto {
  id: string;
  name: string;
  order?: number;
}

export interface CategoryRequestDto {
  name: string;
  order?: number;
}

// Skill 타입
export interface SkillDto {
  id: string;
  name: string;
  categoryId?: string;
  order?: number;
}

export interface SkillRequestDto {
  name: string;
  categoryId?: string;
  order?: number;
}

export interface SkillsDto {
  skills: SkillDto[];
  categories?: CategoryDto[];
}

