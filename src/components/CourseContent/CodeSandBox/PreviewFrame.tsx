import { useRef, useEffect, useState } from 'react';
import type { PreviewFrameProps } from './types';
import { generateReactHTML, generateVanillaHTML } from './utils';

export const PreviewFrame = ({ 
  code, 
  isReactCode, 
  onHeightChange,
  minHeight,
  maxHeight
}: PreviewFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(minHeight);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const content = isReactCode 
      ? generateReactHTML(code)
      : generateVanillaHTML(code);
    
    setHtmlContent(content);
    setIframeHeight(minHeight);
  }, [code, isReactCode, minHeight]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'resize' && typeof event.data.height === 'number') {
        const newHeight = Math.min(
          Math.max(event.data.height + 20, minHeight), 
          maxHeight
        );
        setIframeHeight(newHeight);
        onHeightChange?.(newHeight);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [minHeight, maxHeight, onHeightChange]);

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 sm:px-3 sm:py-1.5">
        <h4 className="text-xs sm:text-[10px] font-medium text-gray-600 dark:text-gray-300">
          실행 결과
        </h4>
      </div>
      <iframe
        ref={iframeRef}
        title="code-preview"
        srcDoc={htmlContent}
        sandbox="allow-scripts allow-same-origin"
        className="w-full border-none"
        style={{ 
          height: `${iframeHeight}px`,
          transition: 'height 0.2s ease-out'
        }}
      />
    </div>
  );
};