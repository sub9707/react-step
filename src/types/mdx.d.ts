declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare module '*.md' {
  const content: string;
  export default content;
}

// 임베디드 컴포넌트 타입 정의
export interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface EmbeddedComponentProps {
  images: ImageItem[];
  [key: string]: any;
}

export interface ComponentRegistry {
  [componentName: string]: React.ComponentType<any>;
}

// MDX 메타데이터 타입
export interface MDXMetadata {
  title?: string;
  description?: string;
  difficulty?: string;
  duration?: string;
  tags?: string[];
  author?: string;
  lastUpdated?: string;
  [key: string]: any;
}

// MDX 콘텐츠 타입
export interface MDXContent {
  default: React.ComponentType;
  metadata?: MDXMetadata;
}