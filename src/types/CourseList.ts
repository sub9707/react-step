/**
 * 난이도 레벨 타입
 */
export type LevelType = '초급' | '중급' | '고급';

/**
 * 영어 레벨 타입 (폴더명)
 */
export type EnglishLevelType = 'beginner' | 'intermediate' | 'advanced';

/**
 * 난이도 타입
 */
export type DifficultyType = '쉬움' | '보통' | '어려움';

/**
 * MDX 파일에서 export되는 메타데이터 구조
 */
export interface MDXMetadata {
  id: number;
  title: string;
  description: string;
  difficulty: DifficultyType;
  tags: string[];
  lastUpdated: string;
  image: string;
  author?: string;
  duration?: string;
}

/**
 * 학습 카드에서 사용하는 아이템 타입
 * MDX 메타데이터와 동일한 구조
 */
export interface LearningItem extends MDXMetadata {}

/**
 * 레벨 매핑 타입
 */
export interface LevelMapping {
  korean: LevelType;
  english: EnglishLevelType;
}

/**
 * 레슨 상태 타입
 */
export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

/**
 * 학습 진행 상황 타입
 */
export interface LearningProgress {
  lessonId: number;
  status: LessonStatus;
  completedAt?: Date;
  timeSpent?: number; // 분 단위
}

/**
 * 코스 통계 타입
 */
export interface CourseStats {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  estimatedTimeRemaining: number; // 분 단위
}

/**
 * 코스 레벨 정보 타입
 */
export interface CourseLevelInfo {
  level: LevelType;
  englishLevel: EnglishLevelType;
  title: string;
  description: string;
  lessons: LearningItem[];
  stats?: CourseStats;
}

/**
 * 전체 코스 데이터 타입
 */
export interface CourseData {
  beginner: LearningItem[];
  intermediate: LearningItem[];
  advanced: LearningItem[];
}

/**
 * API 응답 타입
 */
export interface CourseListResponse {
  data: LearningItem[];
  totalCount: number;
  level: LevelType;
  lastUpdated: string;
}

/**
 * 에러 타입
 */
export interface CourseError {
  code: string;
  message: string;
  level?: LevelType;
  lessonId?: number;
}

/**
 * 로딩 상태 타입
 */
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

/**
 * 훅 반환 타입
 */
export interface UseLearningDataReturn {
  data: LearningItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  stats?: CourseStats;
}

/**
 * 레슨 네비게이션 타입
 */
export interface LessonNavigation {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextLessonId?: number;
  previousLessonId?: number;
}

/**
 * 컴포넌트 Props 타입들
 */
export interface CourseListProps {
  level?: LevelType;
  showProgress?: boolean;
  onLessonSelect?: (lessonId: number) => void;
}

export interface LearningCardProps {
  item: LearningItem;
  index: number;
  level: LevelType;
  progress?: LearningProgress;
  onClick?: () => void;
}

export interface CourseHeaderProps {
  level: LevelType;
  totalLessons: number;
  onBack: () => void;
}

/**
 * 유틸리티 타입들
 */
export type LessonId = number;
export type CourseLevel = LevelType;

/**
 * 타입 가드 함수들
 */
export const isValidLevel = (level: string): level is LevelType => {
  return ['초급', '중급', '고급'].includes(level);
};

export const isValidDifficulty = (difficulty: string): difficulty is DifficultyType => {
  return ['쉬움', '보통', '어려움'].includes(difficulty);
};

export const isValidEnglishLevel = (level: string): level is EnglishLevelType => {
  return ['beginner', 'intermediate', 'advanced'].includes(level);
};

/**
 * 상수 정의
 */
export const LEVEL_MAPPINGS: Record<LevelType, EnglishLevelType> = {
  '초급': 'beginner',
  '중급': 'intermediate',
  '고급': 'advanced'
} as const;

export const ENGLISH_LEVEL_MAPPINGS: Record<EnglishLevelType, LevelType> = {
  'beginner': '초급',
  'intermediate': '중급',
  'advanced': '고급'
} as const;

export const DIFFICULTY_COLORS: Record<DifficultyType, string> = {
  '쉬움': 'text-green-500',
  '보통': 'text-yellow-500',
  '어려움': 'text-red-500'
} as const;

export const LEVEL_DESCRIPTIONS: Record<LevelType, string> = {
  '초급': 'React의 기초부터 차근차근 배워보세요',
  '중급': 'React의 고급 기능들을 활용해보세요',
  '고급': 'React 전문가로 성장하는 과정입니다'
} as const;