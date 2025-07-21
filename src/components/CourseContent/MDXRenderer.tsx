import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { componentRegistry } from './EmbeddedComponents';
import type { ComponentRegistry } from '../../types/mdx';
import type { JSX } from 'react/jsx-runtime';

// 코드 복사 기능을 위한 상태 관리
interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const [copied, setCopied] = React.useState(false);
  const language = className?.replace('language-', '') || '';
  
  const copyToClipboard = async () => {
    const code = React.Children.toArray(children).join('');
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 text-sm rounded-t-lg border-b border-gray-200 dark:border-gray-700">
        <span className="font-medium">{language || 'code'}</span>
        <button
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
          title="코드 복사"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm leading-relaxed border border-gray-200 dark:border-gray-700">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

// 인라인 코드 컴포넌트
const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm font-mono border border-blue-200 dark:border-blue-800">
    {children}
  </code>
);

// ID 생성 함수
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// 헤딩 컴포넌트 생성
const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const HeadingComponent: React.FC<{ children?: React.ReactNode; id?: string }> = ({ children, id }) => {
    const sizes = {
      1: 'text-4xl font-bold mt-8 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700',
      2: 'text-3xl font-bold mt-8 mb-4',
      3: 'text-2xl font-semibold mt-6 mb-3',
      4: 'text-xl font-semibold mt-4 mb-2',
      5: 'text-lg font-medium mt-4 mb-2',
      6: 'text-base font-medium mt-3 mb-2'
    };

    const headingId = id || (typeof children === 'string' ? generateHeadingId(children) : undefined);

    const commonProps = {
      id: headingId,
      className: `scroll-mt-20 text-gray-900 dark:text-gray-100 ${sizes[level]} group`
    };

    const content = (
      <a href={`#${headingId}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {children}
      </a>
    );

    const TagName = `h${level}` as keyof JSX.IntrinsicElements;
    return React.createElement(TagName, commonProps, content);
  };

  return HeadingComponent;
};

// 기본 MDX 컴포넌트들
const mdxComponents = {
  // 헤딩
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  
  // 텍스트
  p: ({ children }: any) => (
    <p className="text-gray-800 dark:text-gray-200 leading-relaxed my-4">
      {children}
    </p>
  ),
  
  strong: ({ children }: any) => (
    <strong className="font-bold text-gray-900 dark:text-gray-100">
      {children}
    </strong>
  ),
  
  em: ({ children }: any) => (
    <em className="italic text-gray-800 dark:text-gray-200">
      {children}
    </em>
  ),
  
  // 코드
  code: ({ children, className }: any) => {
    if (className) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <InlineCode>{children}</InlineCode>;
  },
  
  pre: ({ children }: any) => children, // CodeBlock에서 처리
  
  // 테이블
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  ),
  
  thead: ({ children }: any) => (
    <thead className="bg-gray-50 dark:bg-gray-800">
      {children}
    </thead>
  ),
  
  tbody: ({ children }: any) => (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  ),
  
  tr: ({ children }: any) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      {children}
    </tr>
  ),
  
  th: ({ children }: any) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  ),
  
  td: ({ children }: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
      {children}
    </td>
  ),
  
  // 리스트
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside space-y-2 my-4 ml-4 text-gray-800 dark:text-gray-200">
      {children}
    </ol>
  ),
  
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside space-y-2 my-4 ml-4 text-gray-800 dark:text-gray-200">
      {children}
    </ul>
  ),
  
  li: ({ children }: any) => (
    <li className="leading-relaxed hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
      {children}
    </li>
  ),
  
  // 인용문
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-6 rounded-r-lg">
      <div className="text-blue-800 dark:text-blue-200">{children}</div>
    </blockquote>
  ),
  
  // 링크
  a: ({ href, children }: any) => {
    const isExternal = href?.startsWith('http');
    
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors inline-flex items-center gap-1"
      >
        {children}
        {isExternal && <ExternalLink className="w-3 h-3" />}
      </a>
    );
  },
  
  // 구분선
  hr: () => (
    <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
  ),
  
  // 이미지
  img: ({ src, alt }: any) => (
    <div className="my-6">
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      />
      {alt && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  ),

  // 임베디드 컴포넌트들 추가
  ...componentRegistry
};

interface MDXRendererProps {
  children: React.ReactNode;
  components?: ComponentRegistry;
  className?: string;
}

const MDXRenderer: React.FC<MDXRendererProps> = ({ 
  children, 
  components = {}, 
  className = '' 
}) => {
  // 사용자 정의 컴포넌트와 기본 컴포넌트 병합
  const allComponents = { ...mdxComponents, ...components };

  return (
    <div className={`prose prose-xl max-w-none ${className}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* 라이트 모드 코드 하이라이팅 */
          .hljs {
            background: rgb(249 250 251) !important;
            color: rgb(55 65 81);
          }
          .hljs-keyword { color: rgb(147 51 234); }
          .hljs-string { color: rgb(34 197 94); }
          .hljs-comment { color: rgb(107 114 128); font-style: italic; }
          .hljs-number { color: rgb(239 68 68); }
          .hljs-title { color: rgb(59 130 246); }
          .hljs-params { color: rgb(245 158 11); }
          .hljs-built_in { color: rgb(14 165 233); }
          .hljs-literal { color: rgb(168 85 247); }
          .hljs-attr { color: rgb(34 197 94); }
          .hljs-tag { color: rgb(147 51 234); }
          .hljs-name { color: rgb(147 51 234); }
          .hljs-attribute { color: rgb(34 197 94); }
          
          /* 다크 모드 코드 하이라이팅 */
          .dark .hljs {
            background: rgb(17 24 39) !important;
            color: #f8f8f2;
          }
          .dark .hljs-keyword { color: #ff79c6; }
          .dark .hljs-string { color: #f1fa8c; }
          .dark .hljs-comment { color: #6272a4; font-style: italic; }
          .dark .hljs-number { color: #bd93f9; }
          .dark .hljs-title { color: #50fa7b; }
          .dark .hljs-params { color: #ffb86c; }
          .dark .hljs-built_in { color: #8be9fd; }
          .dark .hljs-literal { color: #bd93f9; }
          .dark .hljs-attr { color: #50fa7b; }
          .dark .hljs-tag { color: #ff79c6; }
          .dark .hljs-name { color: #ff79c6; }
          .dark .hljs-attribute { color: #50fa7b; }
        `
      }} />
      
      <MDXProvider components={allComponents}>
        {children}
      </MDXProvider>
    </div>
  );
};

export default MDXRenderer;