import React, { useState, useEffect } from 'react';
import type { MDXContent, MDXMetadata } from '../types/mdx';

interface UseMDXContentReturn {
  MDXComponent: React.ComponentType | null;
  loading: boolean;
  error: string | null;
  metadata: MDXMetadata | null;
}

export const useMDXContent = (level: string, lessonId: string): UseMDXContentReturn => {
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MDXMetadata | null>(null);

  useEffect(() => {
    const loadMDXContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // MDX 파일 경로 구성
        const mdxPath = `/src/assets/contents/courses/${level}/lesson-${lessonId}.mdx`;
        
        try {
          // 동적 MDX 파일 import
          const mdxModule = await import(/* @vite-ignore */ mdxPath) as MDXContent;
          
          // 메타데이터가 export되어 있으면 사용
          if (mdxModule.metadata) {
            setMetadata(mdxModule.metadata);
          }
          
          // MDX 컴포넌트 설정
          setMDXComponent(() => mdxModule.default);
          
        } catch (mdxError) {
          // MDX 파일이 없는 경우, .md 파일을 시도
          console.warn(`MDX 파일을 찾을 수 없음: ${mdxPath}, MD 파일을 시도합니다.`);
          
          const markdownPath = `/src/content/${level}/lesson-${lessonId}.md`;
          const response = await fetch(markdownPath);
          
          if (!response.ok) {
            throw new Error(`콘텐츠를 찾을 수 없습니다: ${response.status}`);
          }
          
          const markdownContent = await response.text();
          
          // Front Matter 파싱
          const { content: parsedContent, metadata: parsedMetadata } = parseMarkdownWithMetadata(markdownContent);
          
          const MarkdownComponent: React.FC = () => {
            return React.createElement('div', {
              dangerouslySetInnerHTML: { __html: markdownToHTML(parsedContent) }
            });
          };
          
          setMDXComponent(() => MarkdownComponent);
          setMetadata(parsedMetadata);
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

// Front Matter 파싱 함수 (Markdown 파일용)
function parseMarkdownWithMetadata(content: string): { content: string; metadata: MDXMetadata } {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n/s;
  const match = content.match(frontmatterRegex);
  
  let metadata: MDXMetadata = {};
  let cleanedContent = content;
  
  if (match) {
    // Front Matter 제거
    cleanedContent = content.replace(frontmatterRegex, '');
    
    // YAML 파싱 (간단한 구현)
    const frontMatterText = match[1];
    const lines = frontMatterText.split('\n');
    
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        
        // 배열 처리
        if (value.startsWith('[') && value.endsWith(']')) {
          const arrayValue = value.slice(1, -1).split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
          metadata[key] = arrayValue;
        } else {
          metadata[key] = value;
        }
      }
    });
  }
  
  return {
    content: cleanedContent,
    metadata
  };
}

// 간단한 마크다운 to HTML 변환
function markdownToHTML(content: string): string {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>');
}

// 컴포넌트 동적 로딩을 위한 헬퍼 함수
export const loadMDXComponent = async (path: string): Promise<MDXContent | null> => {
  try {
    const module = await import(/* @vite-ignore */ path);
    return module as MDXContent;
  } catch (error) {
    console.error(`MDX 컴포넌트 로딩 실패: ${path}`, error);
    return null;
  }
};

// MDX 파일 목록 가져오기
export const getMDXFileList = async (level: string): Promise<string[]> => {
  try {
    const commonFiles = ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'];
    return commonFiles;
  } catch (error) {
    console.error('MDX 파일 목록 로딩 실패:', error);
    return [];
  }
};