import React, { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface NavigationBarProps {
  MDXComponent?: React.ComponentType;
  markdownContent?: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  MDXComponent, 
  markdownContent 
}) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  // 고유한 ID 생성을 위한 카운터
  const usedIds = new Set<string>();

  const generateUniqueHeadingId = (text: string): string => {
    const baseId = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let uniqueId = baseId;
    let counter = 1;
    
    // 이미 사용된 ID라면 숫자를 붙여서 고유하게 만듦
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }
    
    usedIds.add(uniqueId);
    return uniqueId;
  };

  // MDX 컴포넌트 또는 마크다운에서 헤더 추출
  useEffect(() => {
    // 새로운 추출 시 사용된 ID 초기화
    usedIds.clear();

    const extractHeadingsFromDOM = (): HeadingItem[] => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headings: HeadingItem[] = [];

      headingElements.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const level = parseInt(tagName.charAt(1));
        const text = element.textContent || '';
        
        // 기존 ID가 있으면 사용하고, 없으면 새로 생성
        let id = element.id;
        if (!id) {
          id = generateUniqueHeadingId(text);
          element.id = id;
        } else {
          // 기존 ID도 중복 체크에 추가
          usedIds.add(id);
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
        const id = generateUniqueHeadingId(text);
        
        if (id) {
          headings.push({ id, text, level });
        }
      }

      return headings;
    };

    // MDX 컴포넌트가 있는 경우 DOM에서 추출, 없으면 마크다운에서 추출
    if (MDXComponent) {
      // DOM이 업데이트된 후 헤딩 추출
      const timeoutId = setTimeout(() => {
        const extractedHeadings = extractHeadingsFromDOM();
        setHeadings(extractedHeadings);
      }, 100);

      return () => clearTimeout(timeoutId);
    } else if (markdownContent) {
      const extractedHeadings = extractHeadingsFromMarkdown(markdownContent);
      setHeadings(extractedHeadings);
    }
  }, [MDXComponent, markdownContent]);

  // 스크롤 위치에 따른 활성 헤더 감지 (개선됨)
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;
      
      const headingElements = headings
        .map(h => ({ element: document.getElementById(h.id), id: h.id }))
        .filter(item => item.element !== null);
      
      if (headingElements.length === 0) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const centerPoint = scrollTop + windowHeight / 2; // 화면 중앙 기준점
      
      let activeHeading = headingElements[0].id;
      let minDistance = Infinity;

      // 화면 중앙에 가장 가까운 헤더를 찾음
      for (const { element, id } of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollTop;
          const distanceFromCenter = Math.abs(elementTop - centerPoint);
          
          // 헤더가 화면에 보이는 경우에만 고려
          if (rect.top < windowHeight && rect.bottom > 0) {
            if (distanceFromCenter < minDistance) {
              minDistance = distanceFromCenter;
              activeHeading = id;
            }
          }
        }
      }

      // 만약 화면에 보이는 헤더가 없다면 기존 방식 사용
      if (minDistance === Infinity) {
        for (const { element, id } of headingElements) {
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            
            if (elementTop - 100 <= scrollTop) {
              activeHeading = id;
            }
          }
        }
      }

      setActiveId(activeHeading);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timeoutId = setTimeout(handleScroll, 200);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    
    if (element) {
      // 화면 중앙으로 스크롤하도록 수정
      const elementTop = element.offsetTop;
      const windowHeight = window.innerHeight;
      const scrollToPosition = elementTop - (windowHeight / 2) + (element.offsetHeight / 2);
      
      window.scrollTo({ 
        top: Math.max(0, scrollToPosition),
        behavior: 'smooth'
      });
      setActiveId(id);
    } else {
      console.warn(`ID "${id}"를 가진 요소를 찾을 수 없습니다.`);
    }
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
      {/* 토글 버튼 - 네비게이션 바와 함께 움직임 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-50 z-40 p-3 bg-white dark:bg-[#2b2b2b] rounded-l-lg
          border border-r-0 border-gray-200 dark:border-[#3e3e3e]
          transition-all duration-300
          ${isOpen ? 'right-75' : 'right-0'}
        `}
        aria-label="목차 열기/닫기"
      >
        <List className="w-5 h-5 text-gray-600 dark:text-[#c2c2c2]" />
      </button>

      {/* 네비게이션 바 */}
      <div className={`
        fixed top-20 right-4 w-72 max-h-[calc(100vh-6rem)] bg-white dark:bg-[#2b2b2b] 
        border border-gray-200 dark:border-[#3e3e3e] rounded-xl shadow-lg z-30 
        transition-all duration-300 overflow-hidden
        ${isOpen 
          ? 'translate-x-0 opacity-100 visible' 
          : 'translate-x-full opacity-0 invisible'
        }
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

      {/* 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 lg:bg-black/30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default NavigationBar;