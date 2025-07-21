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

/**
 * 특정 레벨의 MDX 파일들을 스캔하여 메타데이터를 추출합니다
 */
export const generateLearningData = async (level: LevelType): Promise<LearningItem[]> => {
  const folderName = getLevelFolderName(level);
  const lessons: LearningItem[] = [];
  
  // 파일을 순차적으로 확인 (lesson-1.mdx, lesson-2.mdx, ...)
  let lessonId = 1;
  let hasMoreLessons = true;

  while (hasMoreLessons) {
    try {
      // Vite 호환 동적 import 사용
      const lessonModule = await import(
        /* @vite-ignore */
        `../../assets/contents/courses/${folderName}/lesson-${lessonId}.mdx`
      );
      
      if (lessonModule.metadata) {
        lessons.push({
          ...lessonModule.metadata,
          id: lessonId // ID 보장
        });
        lessonId++;
      } else {
        console.warn(`No metadata found in lesson-${lessonId}.mdx for ${level}`);
        hasMoreLessons = false;
      }
    } catch (error) {
      // 파일이 없으면 스캔 중단
      hasMoreLessons = false;
      if (lessonId === 1) {
        // 첫 번째 파일도 없으면 에러로 처리
        throw new Error(`${level} 단계의 강의 파일을 찾을 수 없습니다. (경로: courses/${folderName}/lesson-1.mdx)`);
      }
    }
  }

  // ID 순으로 정렬하여 반환
  return lessons.sort((a, b) => a.id - b.id);
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