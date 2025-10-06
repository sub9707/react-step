import { Play } from 'lucide-react';
import type { ControlBarProps } from './types';

export const ControlBar = ({
  language,
  isReactCode,
  isLoading,
  hideCode,
  editable,
  onRun
}: ControlBarProps) => {
  return (
    <div className={`
      bg-gray-50 dark:bg-gray-800 
      px-4 py-3 sm:px-3 sm:py-2 
      ${!hideCode ? 'border-t border-gray-200 dark:border-gray-700' : ''} 
      flex items-center justify-between
    `}>
      {!hideCode && (
        <span className="
          text-xs sm:text-[10px] 
          text-gray-500 dark:text-gray-400 
          bg-gray-200 dark:bg-gray-700 
          px-2 py-1 sm:px-1.5 sm:py-0.5 
          rounded font-mono
        ">
          {isReactCode ? 'React JSX' : language}
        </span>
      )}
      {hideCode && <div />}
      
      {/* 항상 실행 버튼 표시 */}
      <button
        onClick={onRun}
        disabled={isLoading}
        className="
          flex items-center gap-1 
          text-xs sm:text-[10px] 
          bg-green-500 hover:bg-green-600 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          text-white 
          px-3 py-1.5 sm:px-2 sm:py-1 
          rounded 
          transition-colors
          font-medium
        "
      >
        <Play className="w-3 h-3 sm:w-2.5 sm:h-2.5" />
        {isLoading ? '실행중...' : '실행'}
      </button>
    </div>
  );
};