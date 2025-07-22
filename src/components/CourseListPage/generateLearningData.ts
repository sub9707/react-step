// generateLearningData.ts - MDX 파일 메타데이터 기반 버전
import type { LearningItem, LevelType } from "../../types/CourseList";

/**
 * 레벨명을 영어 폴더명으로 변환
 */
const getLevelFolderName = (level: LevelType): string => {
  const levelMap: Record<LevelType, string> = {
    '초급': 'beginner',
    '중급': 'intermediate',
    '고급': 'advanced'
  };
  return levelMap[level];
};

// MDX 모듈 타입 정의
interface MdxModule {
  metadata?: any; // 또는 실제 metadata 타입으로 대체
  default?: React.ComponentType;
}

export const generateLearningData = async (level: LevelType): Promise<LearningItem[]> => {
  const folderName = getLevelFolderName(level);
  const lessons: LearningItem[] = [];
  
  try {
    const modules = import.meta.glob(
      '../../assets/contents/courses/*/lesson-*.mdx',
      { eager: true }
    );
    
    // 현재 레벨에 해당하는 파일들만 필터링
    const levelModules = Object.entries(modules).filter(([path]) => 
      path.includes(`/courses/${folderName}/`)
    );
    
    // 레슨 번호 추출하여 정렬
    const sortedModules = levelModules
      .map(([path, module]) => {
        const match = path.match(/lesson-(\d+)\.mdx$/);
        const lessonId = match ? parseInt(match[1], 10) : 0;
        return { lessonId, module: module as MdxModule };
      })
      .filter(({ module }) => module?.metadata) // metadata가 있는 것만
      .sort((a, b) => a.lessonId - b.lessonId);
    
    // LearningItem 배열로 변환
    sortedModules.forEach(({ lessonId, module }) => {
      if (module.metadata) {
        lessons.push({
          ...module.metadata,
          id: lessonId
        });
      }
    });
    
    if (lessons.length === 0) {
      throw new Error(`${level} 단계의 강의 파일을 찾을 수 없습니다. (경로: courses/${folderName}/)`);
    }
    
    return lessons;
    
  } catch (error) {
    console.error(`Failed to load lessons for ${level}:`, error);
    throw new Error(`${level} 단계의 강의 파일을 불러오는데 실패했습니다.`);
  }
};
/**
 * 특정 레슨의 메타데이터만 가져옵니다
 */
export const getSingleLessonMetadata = async (
  level: LevelType,
  lessonId: number
): Promise<LearningItem | null> => {
  const folderName = getLevelFolderName(level);

  try {
    const lessonModule = await import(
      /* @vite-ignore */
      `../../assets/contents/courses/${folderName}/lesson-${lessonId}.mdx`
    );

    if (lessonModule.metadata) {
      return {
        ...lessonModule.metadata,
        id: lessonId
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to load lesson-${lessonId}.mdx for ${level}:`, error);
    return null;
  }
};

/**
 * 특정 레벨의 사용 가능한 레슨 수를 확인합니다
 */
export const getAvailableLessonCount = async (level: LevelType): Promise<number> => {
  const folderName = getLevelFolderName(level);
  let count = 0;
  let hasMore = true;
  let lessonId = 1;

  while (hasMore) {
    try {
      await import(
        /* @vite-ignore */
        `../../assets/contents/courses/${folderName}/lesson-${lessonId}.mdx`
      );
      count++;
      lessonId++;
    } catch {
      hasMore = false;
    }
  }

  return count;
};

/**
 * 모든 레벨의 메타데이터를 가져옵니다 (관리 목적)
 */
export const getAllLevelsMetadata = async (): Promise<Record<LevelType, LearningItem[]>> => {
  const result: Record<LevelType, LearningItem[]> = {
    '초급': [],
    '중급': [],
    '고급': []
  };

  for (const level of Object.keys(result) as LevelType[]) {
    try {
      result[level] = await generateLearningData(level);
    } catch (error) {
      console.error(`Failed to load ${level} data:`, error);
      result[level] = [];
    }
  }

  return result;
};