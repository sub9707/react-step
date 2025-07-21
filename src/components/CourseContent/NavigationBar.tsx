import React, { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface NavigationBarProps {
  MDXComponent?: React.ComponentType;
  markdownContent?: string; // 기존 마크다운 콘텐츠와의 호환성
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  MDXComponent, 
  markdownContent 
}) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // MDX 컴포넌트 또는 마크다운에서 헤더 추출
  useEffect(() => {
    const extractHeadingsFromDOM = (): HeadingItem[] => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headings: HeadingItem[] = [];

      headingElements.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const level = parseInt(tagName.charAt(1));
        const text = element.textContent || '';
        const id = element.id || generateHeadingId(text);
        
        // ID가 없으면 생성해서 할당
        if (!element.id) {
          element.id = id;
        }
        
        if (text && id) {
          headings.push({ id, text, level });
        }
      });

      return headings;
    };

    const extractHeadingsFromMarkdown = (content: string): HeadingItem[] => {
      const headerRegex = /^(#{1,6})\s+(.+)$/gm;
      const headings: HeadingItem[] = [];
      let match;

      while ((match = headerRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = generateHeadingId(text);
        
        if (id) {
          headings.push({ id, text, level });
        }
      }

      return headings;
    };

    const generateHeadingId = (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^\w\s가-힣]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // MDX 컴포넌트가 있는 경우 DOM에서 추출, 없으면 마크다운에서 추출
    if (MDXComponent) {
      // DOM이 업데이트된 후 헤딩 추출
      const timeoutId = setTimeout(() => {
        const extractedHeadings = extractHeadingsFromDOM();
        setHeadings(extractedHeadings);
        console.log('MDX에서 추출된 헤더들:', extractedHeadings);
      }, 100);

      return () => clearTimeout(timeoutId);
    } else if (markdownContent) {
      const extractedHeadings = extractHeadingsFromMarkdown(markdownContent);
      setHeadings(extractedHeadings);
      console.log('마크다운에서 추출된 헤더들:', extractedHeadings);
    }
  }, [MDXComponent, markdownContent]);

  // 스크롤 위치에 따른 활성 헤더 감지
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;
      
      const headingElements = headings
        .map(h => ({ element: document.getElementById(h.id), id: h.id }))
        .filter(item => item.element !== null);
      
      if (headingElements.length === 0) return;

      const scrollTop = window.scrollY;
      let activeHeading = headingElements[0].id;

      for (const { element, id } of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollTop;
          
          if (elementTop - 150 <= scrollTop) {
            activeHeading = id;
          }
        }
      }

      setActiveId(activeHeading);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timeoutId = setTimeout(handleScroll, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    console.log('스크롤 시도:', id);
    const element = document.getElementById(id);
    console.log('찾은 요소:', element);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      setActiveId(id);
    } else {
      console.warn(`ID "${id}"를 가진 요소를 찾을 수 없습니다.`);
    }
    
    setIsOpen(false);
  };

  const getIndentClass = (level: number) => {
    switch (level) {
      case 1: return 'ml-0';
      case 2: return 'ml-3';
      case 3: return 'ml-6';
      case 4: return 'ml-9';
      case 5: return 'ml-12';
      case 6: return 'ml-15';
      default: return 'ml-0';
    }
  };

  const getFontSize = (level: number) => {
    switch (level) {
      case 1: return 'text-sm font-bold';
      case 2: return 'text-sm font-semibold';
      case 3: return 'text-xs font-medium';
      default: return 'text-xs';
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 right-4 z-40 p-3 bg-white dark:bg-[#2b2b2b] rounded-full shadow-lg border border-gray-200 dark:border-[#3e3e3e]"
        aria-label="목차 열기/닫기"
      >
        <List className="w-5 h-5 text-gray-600 dark:text-[#c2c2c2]" />
      </button>

      {/* 네비게이션 바 */}
      <div className={`
        fixed top-20 right-4 w-72 max-h-[calc(100vh-6rem)] bg-white dark:bg-[#2b2b2b] 
        border border-gray-200 dark:border-[#3e3e3e] rounded-xl shadow-lg z-30 
        transition-all duration-300 overflow-hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-[#3e3e3e]">
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#f8f8f8] flex items-center gap-2">
            <List className="w-5 h-5" />
            목차
          </h3>
        </div>
        
        <div className="p-4 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-12rem)]">
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  w-full text-left p-2 rounded-lg transition-all duration-200 group
                  ${getIndentClass(heading.level)} ${getFontSize(heading.level)}
                  ${activeId === heading.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500' 
                    : 'text-gray-600 dark:text-[#c2c2c2] hover:bg-gray-50 dark:hover:bg-[#3e3e3e] hover:text-gray-900 dark:hover:text-[#f8f8f8]'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className={`w-3 h-3 transition-transform ${activeId === heading.id ? 'rotate-90' : ''}`} />
                  <span className="truncate">{heading.text}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default NavigationBar;