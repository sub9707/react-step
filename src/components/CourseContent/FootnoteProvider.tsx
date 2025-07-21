import React, { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';
import { X, Book } from 'lucide-react';

// 각주 데이터 타입 정의 (JSX 지원)
export interface FootnoteData {
  id: string;
  content: ReactNode; // JSX 또는 HTML 문자열 모두 지원
}

// 각주 컨텍스트 타입
interface FootnoteContextType {
  footnotes: Record<string, FootnoteData>;
  openModal: (id: string) => void;
  closeModal: () => void;
  isOpen: boolean;
  currentFootnote: FootnoteData | null;
}

// 각주 프로바이더 Props
interface FootnoteProviderProps {
  children: ReactNode;
  dataFile?: string; // JSON 파일 경로 (선택적)
  data?: Record<string, FootnoteData>; // 직접 데이터 전달 (선택적)
}

// 각주 링크 Props
interface FootnoteLinkProps {
  id: string;
  children: ReactNode;
  className?: string;
}

// 각주 컨텍스트 생성
const FootnoteContext = createContext<FootnoteContextType | null>(null);

// 각주 프로바이더 컴포넌트
export const FootnoteProvider: React.FC<FootnoteProviderProps> = ({ 
  children, 
  dataFile,
  data 
}) => {
  const [footnotes, setFootnotes] = useState<Record<string, FootnoteData>>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentFootnote, setCurrentFootnote] = useState<FootnoteData | null>(null);

  // 데이터 로드 (JSON 파일 또는 직접 데이터)
  useEffect(() => {
    // 직접 데이터가 제공된 경우
    if (data) {
      setFootnotes(data);
      return;
    }

    // JSON 파일에서 로드
    if (dataFile) {
      const loadFootnotes = async (): Promise<void> => {
        try {
          const response = await fetch(dataFile);
          if (response.ok) {
            const jsonData = await response.json();
            
            // JSON 데이터를 FootnoteData 형태로 변환
            const convertedData: Record<string, FootnoteData> = {};
            Object.entries(jsonData).forEach(([key, value]: [string, any]) => {
              if (value && typeof value === 'object' && value.id && value.content) {
                convertedData[key] = {
                  id: value.id,
                  content: typeof value.content === 'string' 
                    ? <div dangerouslySetInnerHTML={{ __html: value.content }} />
                    : value.content
                };
              }
            });
            
            setFootnotes(convertedData);
          }
        } catch (error) {
          console.error('각주 데이터 로드 오류:', error);
        }
      };

      loadFootnotes();
    }
  }, [dataFile, data]);

  // 모달 열기
  const openModal = (id: string): void => {
    const footnote = footnotes[id];
    if (footnote) {
      setCurrentFootnote(footnote);
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  // 모달 닫기
  const closeModal = (): void => {
    setIsOpen(false);
    setCurrentFootnote(null);
    document.body.style.overflow = 'unset';
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  return (
    <FootnoteContext.Provider value={{
      footnotes,
      openModal,
      closeModal,
      isOpen,
      currentFootnote
    }}>
      {children}
      {isOpen && <FootnoteModal />}
    </FootnoteContext.Provider>
  );
};

// 각주 링크 컴포넌트
export const FootnoteLink: React.FC<FootnoteLinkProps> = ({ 
  id, 
  children, 
  className = '' 
}) => {
  const context = useContext(FootnoteContext);
  
  if (!context) {
    return <span className={className}>{children}</span>;
  }

  const { footnotes, openModal } = context;
  const footnoteExists = footnotes[id];

  if (!footnoteExists) {
    return <span className={className}>{children}</span>;
  }

  return (
    <button
      onClick={() => openModal(id)}
      className={`
        inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 
        hover:text-blue-800 dark:hover:text-blue-300 
        underline decoration-dotted underline-offset-2
        hover:decoration-solid transition-all duration-200
        cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 
        focus:ring-offset-2 rounded-sm px-0.5
        ${className}
      `}
      type="button"
      aria-label={`${children}의 정의 보기`}
    >
      {children}
      <Book className="w-3 h-3 opacity-70" />
    </button>
  );
};

// 각주 모달 컴포넌트
const FootnoteModal: React.FC = () => {
  const context = useContext(FootnoteContext);
  
  if (!context) return null;

  const { currentFootnote, closeModal } = context;

  if (!currentFootnote) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/70 bg-opacity-50" />
      
      {/* 모달 컨테이너 */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {currentFootnote.id}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 내용 - JSX 직접 렌더링 */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-sm dark:text-white dark:prose-invert max-w-none">
            {currentFootnote.content}
          </div>
        </div>
      </div>
    </div>
  );
};


export default {
  FootnoteProvider,
  FootnoteLink,
};