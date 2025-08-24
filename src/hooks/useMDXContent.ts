import React, { useState, useEffect } from 'react';
import type { MDXMetadata } from '../types/mdx';
import { getLevelFolderName } from '../components/CourseListPage/generateLearningData';
import type { LevelType } from '../types/CourseList';

interface UseMDXContentReturn {
  MDXComponent: React.ComponentType | null;
  loading: boolean;
  error: string | null;
  metadata: MDXMetadata | null;
}

// Vite의 glob import를 사용하여 모든 MDX 파일을 미리 로드
const mdxModules = import.meta.glob('/src/assets/contents/courses/**/*.mdx', { 
  eager: false,
  import: 'default'
});

const mdxMetadataModules = import.meta.glob('/src/assets/contents/courses/**/*.mdx', { 
  eager: false,
  import: 'metadata'
});

export const useMDXContent = (level: LevelType, lessonId: string): UseMDXContentReturn => {
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MDXMetadata | null>(null);

  useEffect(() => {
    const loadMDXContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const mappedLevel = getLevelFolderName(level);

        // MDX 파일 경로 구성
        const mdxPath = `/src/assets/contents/courses/${mappedLevel}/lesson-${lessonId}.mdx`;
        
        // glob으로 로드된 모듈에서 해당 파일 찾기
        const moduleLoader = mdxModules[mdxPath];
        const metadataLoader = mdxMetadataModules[mdxPath];
        
        if (!moduleLoader) {
          throw new Error(`레슨 파일을 찾을 수 없습니다: ${mappedLevel}/lesson-${lessonId}`);
        }

        // 비동기로 MDX 모듈 로드
        const [mdxModule, moduleMetadata] = await Promise.all([
          moduleLoader(),
          metadataLoader?.() || Promise.resolve(null)
        ]);
        
        // MDX 컴포넌트 설정
        setMDXComponent(() => mdxModule as React.ComponentType);
        
        // 메타데이터 설정
        if (moduleMetadata) {
          setMetadata(moduleMetadata as MDXMetadata);
        }
        
      } catch (err) {
        console.error('MDX 콘텐츠 로딩 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        setMDXComponent(null);
      } finally {
        setLoading(false);
      }
    };

    loadMDXContent();
  }, [level, lessonId]);

  return { MDXComponent, loading, error, metadata };
};

// 사용 가능한 레슨 목록 가져오기
export const getAvailableLessons = (level: string): number[] => {
  const lessons: number[] = [];
  
  Object.keys(mdxModules).forEach(path => {
    const match = path.match(new RegExp(`/courses/${level}/lesson-(\\d+)\\.mdx$`));
    if (match) {
      lessons.push(parseInt(match[1]));
    }
  });
  
  return lessons.sort((a, b) => a - b);
};

// 특정 레벨의 모든 레슨 메타데이터 가져오기
export const getLevelMetadata = async (level: string): Promise<Record<string, MDXMetadata>> => {
  const levelMetadata: Record<string, MDXMetadata> = {};
  
  const relevantPaths = Object.keys(mdxMetadataModules).filter(path => 
    path.includes(`/courses/${level}/`)
  );
  
  await Promise.all(
    relevantPaths.map(async (path) => {
      try {
        const match = path.match(/lesson-(\d+)\.mdx$/);
        if (match) {
          const lessonId = match[1];
          const metadataLoader = mdxMetadataModules[path];
          if (metadataLoader) {
            const metadata = await metadataLoader() as MDXMetadata;
            levelMetadata[lessonId] = metadata;
          }
        }
      } catch (error) {
        console.warn(`메타데이터 로딩 실패: ${path}`, error);
      }
    })
  );
  
  return levelMetadata;
};