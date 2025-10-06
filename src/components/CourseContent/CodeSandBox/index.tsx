import { useState } from 'react';
import type { CodeSandboxProps } from './types';
import { CodeEditor } from './CodeEditor';
import { PreviewFrame } from './PreviewFrame';
import { ControlBar } from './ControlBar';
import { ErrorBoundary } from './ErrorBoundary';
import { isReactCode, smartFormatCode } from './utils';

export const CodeSandbox = ({ 
  code = '', 
  language = 'javascript', 
  title = 'Code Example',
  editable = false,
  hideCode = false,
  minHeight = 150,
  maxHeight = 800,
  autoHeight = true
}: CodeSandboxProps) => {
  const [currentCode, setCurrentCode] = useState(code);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);

  const isReact = isReactCode(currentCode);

  const handleRun = () => {
    setIsLoading(true);
    setTimeout(() => {
      setHasExecuted(true);
      setIsLoading(false);
    }, 300);
  };

  const displayCode = editable ? currentCode : smartFormatCode(currentCode);

  return (
    <ErrorBoundary>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden my-6 sm:my-4">
        {!hideCode && (
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 sm:px-3 sm:py-2">
            <h3 className="text-base sm:text-sm font-medium text-gray-700 dark:text-gray-200">
              {title}
            </h3>
          </div>
        )}
        
        {!hideCode && (
          <CodeEditor
            code={displayCode}
            language={language}
            editable={editable}
            onChange={setCurrentCode}
          />
        )}
        
        <ControlBar
          language={language}
          isReactCode={isReact}
          isLoading={isLoading}
          hideCode={hideCode}
          editable={editable}
          onRun={handleRun}
        />
        
        {hasExecuted && (
          <PreviewFrame
            code={currentCode}
            isReactCode={isReact}
            minHeight={minHeight}
            maxHeight={maxHeight}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};