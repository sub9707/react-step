import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  caption?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src,
  alt,
  caption
}) => {
  // ESC 키 핸들링
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // 모달이 열릴 때 스크롤 방지 및 키보드 이벤트 등록
  useEffect(() => {
    if (isOpen) {
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
      // 모바일 터치 스크롤 방지
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // 키보드 이벤트 등록
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // 스크롤 복원
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 컴포넌트 언마운트 시 스타일 복원
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen, handleKeyDown]);

  // 배경 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={handleBackdropClick}
    >
      {/* 모달 컨테이너 */}
      <div className="relative max-w-[90vw] max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
        {/* 헤더 - 닫기 버튼 */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full transition-all"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 이미지 컨테이너 */}
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain"
            draggable={false}
          />
        </div>
        
        {/* 캡션 */}
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <p className="text-sm text-center">{caption}</p>
          </div>
        )}
      </div>
      
      {/* 모바일용 닫기 안내 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-75 md:hidden">
        화면을 탭하여 닫기
      </div>
    </div>
  );
};