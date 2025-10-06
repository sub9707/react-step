import { useRef, useEffect } from 'react';
import type { CodeEditorProps } from './types';
import { SyntaxHighlighter } from './SyntaxHighlighter';

export const CodeEditor = ({ 
  code, 
  language, 
  editable, 
  onChange 
}: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && editable) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code, editable]);

  if (editable) {
    return (
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full p-3 
          font-mono text-sm 
          bg-gray-50 dark:bg-gray-900 
          text-gray-800 dark:text-gray-200 
          border-none resize-none 
          focus:outline-none
          focus:ring-0
        "
        spellCheck={false}
        placeholder="코드를 입력하세요..."
        style={{ 
          tabSize: 2,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Consolas", monospace',
          lineHeight: '1.6',
          minHeight: '100px',
          whiteSpace: 'pre'
        }}
      />
    );
  }

  return (
    <pre className="
      p-3 m-0
      bg-gray-50 dark:bg-gray-900 
      text-sm 
      overflow-x-auto
    "
    style={{
      tabSize: 2,
      whiteSpace: 'pre'
    }}>
      <SyntaxHighlighter code={code} language={language} />
    </pre>
  );
};