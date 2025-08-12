import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, alt, caption, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 bg-opacity-80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 rounded-full bg-black bg-opacity-50  cursor-pointer"
          aria-label="Close image modal"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <img
            src={src}
            alt={alt}
            className="rounded-lg shadow-xl max-w-full max-h-[90vh] object-contain"
          />
          {caption && (
            <p className="mt-4 text-white text-sm md:text-base text-center w-full">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};