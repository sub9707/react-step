// EmbeddedComponents.tsx
import React, { useRef, useState, type ReactNode, useEffect } from 'react';
import { 
  Play, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle,
  Code,
  FileText,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import type { EmbeddedComponentProps } from '../../types/mdx';
import { ImageModal } from '../common/Modal/ImageModal';

import { CodeSandbox } from './CodeSandBox';
export { CodeSandbox };

// 다운로드 가능한 파일 컴포넌트
export const DownloadableFile: React.FC<EmbeddedComponentProps> = ({
  fileName,
  fileUrl,
  fileSize,
  description,
  fileType = 'file'
}) => {
  const getFileIcon = () => {
    switch (fileType) {
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'code': return <Code className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="flex items-center gap-4">
        <div className="text-blue-600 dark:text-blue-400">
          {getFileIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            {fileName}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
          {fileSize && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {fileSize}
            </span>
          )}
        </div>
        <a
          href={fileUrl}
          download={fileName}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  );
};

// 퀴즈 컴포넌트
export const Quiz: React.FC<EmbeddedComponentProps> = ({
  question,
  options = [],
  correctAnswer,
  explanation
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 my-6 bg-gray-50 dark:bg-gray-800">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        📝 Quiz: {question}
      </h4>
      
      <div className="space-y-3 mb-4">
        {options.map((option: string, index: number) => (
          <label
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              showResult
                ? index === correctAnswer
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                  : selectedAnswer === index
                  ? 'bg-red-100 dark:bg-red-900/30 border-red-500'
                  : 'bg-white dark:bg-gray-700'
                : selectedAnswer === index
                ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            } border`}
          >
            <input
              type="radio"
              name="quiz-option"
              value={index}
              checked={selectedAnswer === index}
              onChange={() => setSelectedAnswer(index)}
              disabled={showResult}
              className="w-4 h-4"
            />
            <span className="text-gray-700 dark:text-gray-200">{option}</span>
            {showResult && index === correctAnswer && (
              <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
            )}
            {showResult && selectedAnswer === index && index !== correctAnswer && (
              <XCircle className="w-5 h-5 text-red-600 ml-auto" />
            )}
          </label>
        ))}
      </div>

      {!showResult ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          정답 확인
        </button>
      ) : (
        <div className={`p-4 rounded-lg ${
          isCorrect 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">
              {isCorrect ? '정답입니다!' : '틀렸습니다.'}
            </span>
          </div>
          {explanation && (
            <p className="text-sm">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
};

// 알림 박스 컴포넌트 (모바일 최적화)
export const CalloutBox: React.FC<EmbeddedComponentProps> = ({
  type = 'info',
  title,
  children
}) => {
  const styles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5" />
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="w-5 h-5" />
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: <XCircle className="w-5 h-5" />
    }
  };

  const style = styles[type as keyof typeof styles] || styles.info;

  return (
    <div className={`${style.bg} ${style.border} ${style.text} border-l-4 p-4 md:p-4 sm:p-3 my-6 md:my-6 sm:my-4 rounded-r-lg sm:-mx-6`}>
      {/* PC 레이아웃 - 아이콘과 텍스트가 나란히 */}
      <div className="hidden md:flex items-start gap-3">
        {style.icon}
        <div className="flex-1">
          {title && (
            <div className="font-semibold mb-2 text-base">{title}</div>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
      
      {/* 모바일 레이아웃 - 아이콘과 텍스트가 세로로 */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 mb-3">
          {style.icon}
          {title && (
            <div className="font-semibold text-sm">{title}</div>
          )}
        </div>
        <div className="text-xs leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// 외부 링크 카드
export const LinkCard: React.FC<EmbeddedComponentProps> = ({
  title,
  description,
  url,
  image,
  tags = []
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
    >
      <div className="flex items-start gap-4">
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            {title}
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </h4>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

// 임베디드 비디오
export const EmbeddedVideo: React.FC<EmbeddedComponentProps> = ({
  src,
  title,
  width = '100%',
  height = '400px',
  autoplay = false
}) => {
  return (
    <div className="my-6">
      {title && (
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </h4>
      )}
      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <iframe
          src={src}
          title={title}
          width={width}
          height={height}
          allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture ${autoplay ? '; autoplay' : ''}`}
          allowFullScreen
          className="w-full"
        />
      </div>
    </div>
  );
};

// 이미지 컴포넌트

// 단일 이미지 인터페이스
interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
  isGif?: boolean; // GIF 여부 명시적 지정
}

// 이미지 너비 타입 정의
type ImageWidth = 'full' | 'half' | 'third' | 'quarter' | 'two-thirds';

// 이미지 컴포넌트 Props
interface ImageGalleryProps extends EmbeddedComponentProps {
  images: ImageItem[];
  width?: ImageWidth;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: boolean;
  border?: boolean;
  autoplayGifs?: boolean; // GIF 자동 재생 여부
  showGifIndicator?: boolean; // GIF 표시기 표시 여부
}

// GIF 감지 함수
const isGifImage = (src: string): boolean => {
  return src.toLowerCase().includes('.gif') || src.toLowerCase().includes('gif');
};

// 이미지 갤러리 컴포넌트
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  width = 'full',
  borderRadius = 'lg',
  shadow = true,
  border = false,
  autoplayGifs = true,
  showGifIndicator = true
}) => {
  const isSingleImage = images.length === 1;

  // Added state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const openModal = (image: ImageItem) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  
  const borderRadiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }[borderRadius];

  // 너비 클래스 매핑 - 모바일에서는 항상 full width
  const widthClass = {
    full: 'w-full',
    half: 'w-full sm:w-1/2',
    third: 'w-full sm:w-1/3',
    quarter: 'w-full sm:w-1/4',
    'two-thirds': 'w-full sm:w-2/3'
  }[width];

  const containerClass = isSingleImage 
    ? `${widthClass} mx-auto` 
    : `flex flex-wrap justify-center gap-4 sm:gap-2 ${widthClass} mx-auto`;

  const imageWrapperClass = isSingleImage
    ? 'w-full'
    : 'flex-1 min-w-0 max-w-sm sm:max-w-none';

  return (
    <>
      <div className="my-8 sm:my-4 w-full flex justify-center">
        <div className={containerClass}>
          <div className={isSingleImage ? 'w-full' : 'flex flex-wrap justify-center gap-4 sm:gap-2 w-full'}>
            {images.map((image, index) => {
              const isGif = image.isGif ?? isGifImage(image.src);
              
              return (
                <div 
                  key={index} 
                  className={`${imageWrapperClass} cursor-pointer`}
                  onClick={() => openModal(image)}
                >
                  <div className="relative group">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`
                        w-full h-auto object-cover transition-all duration-300 
                        ${borderRadiusClass}
                        ${shadow ? 'shadow-md hover:shadow-lg' : ''}
                        ${border ? 'border border-gray-200 dark:border-gray-700' : ''}
                      `}
                      loading="lazy"
                    />
                    
                    {/* GIF 표시기 */}
                    {isGif && showGifIndicator && (
                      <div className="absolute top-2 right-2 sm:top-1 sm:right-1 bg-black bg-opacity-70 text-white text-xs sm:text-[10px] px-2 py-1 sm:px-1.5 sm:py-0.5 rounded-md font-medium">
                        GIF
                      </div>
                    )}
                    
                    {/* 호버 시 재생/일시정지 버튼 (GIF용) */}
                    {isGif && !autoplayGifs && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-3 sm:p-2 cursor-pointer hover:bg-opacity-100 transition-all">
                            <svg className="w-6 h-6 sm:w-4 sm:h-4 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 이미지 설명 텍스트 */}
                  {image.caption && (
                    <p className="text-center text-sm sm:text-xs text-gray-600 dark:text-gray-400 italic mt-3 sm:mt-2 px-2 sm:px-1 leading-tight">
                      {image.caption}
                      {isGif && ' (GIF)'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Render the modal if an image is selected */}
      {isModalOpen && selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          caption={selectedImage.caption}
          onClose={closeModal}
        />
      )}
    </>
  );
};

// 단일 이미지 컴포넌트
export const Image: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  width?: ImageWidth;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: boolean;
  border?: boolean;
  isGif?: boolean;
  autoplayGifs?: boolean;
  showGifIndicator?: boolean;
}> = ({ src, alt, caption, isGif, ...props }) => {
  return (
    <ImageGallery
      images={[{ src, alt, caption, isGif }]}
      {...props}
    />
  );
};

// GIF 전용 편의 컴포넌트
export const GifImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  width?: ImageWidth;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: boolean;
  border?: boolean;
  autoplay?: boolean;
  showIndicator?: boolean;
}> = ({ src, alt, caption, autoplay = true, showIndicator = true, ...props }) => {
  return (
    <ImageGallery
      images={[{ src, alt, caption, isGif: true }]}
      autoplayGifs={autoplay}
      showGifIndicator={showIndicator}
      {...props}
    />
  );
};

// 비교 이미지 컴포넌트 (모바일 최적화)
export const ComparisonImages: React.FC<{
  leftImage: ImageItem;
  rightImage: ImageItem;
  labels?: { left: string; right: string };
  height?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ leftImage, rightImage, labels, height = 'xl' }) => {
  
  // 모바일 기본 높이 (작음) + PC에서 큰 높이
  const heightClasses = {
    sm: 'h-32 sm:h-48',    // 모바일 128px -> PC 192px
    md: 'h-40 sm:h-64',    // 모바일 160px -> PC 256px
    lg: 'h-48 sm:h-80',    // 모바일 192px -> PC 320px
    xl: 'h-56 sm:h-96'     // 모바일 224px -> PC 384px
  };

  return (
    <div className="my-8 sm:my-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-3">
        <div className="relative">
          {labels?.left && (
            <div className="absolute top-4 sm:top-2 left-4 sm:left-2 bg-blue-600 text-white px-3 py-1 sm:px-2 sm:py-0.5 rounded-full text-sm sm:text-xs font-medium z-10">
              {labels.left}
            </div>
          )}
          <div className={`w-full ${heightClasses[height]} overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center`}>
            <img
              src={leftImage.src}
              alt={leftImage.alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            />
          </div>
          {leftImage.caption && (
            <p className="text-center text-sm sm:text-xs text-gray-600 dark:text-gray-400 italic mt-3 sm:mt-2 leading-tight">
              {leftImage.caption}
            </p>
          )}
        </div>
        
        <div className="relative">
          {labels?.right && (
            <div className="absolute top-4 sm:top-2 left-4 sm:left-2 bg-green-600 text-white px-3 py-1 sm:px-2 sm:py-0.5 rounded-full text-sm sm:text-xs font-medium z-10">
              {labels.right}
            </div>
          )}
          <div className={`w-full ${heightClasses[height]} overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center`}>
            <img
              src={rightImage.src}
              alt={rightImage.alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            />
          </div>
          {rightImage.caption && (
            <p className="text-center text-sm sm:text-xs text-gray-600 dark:text-gray-400 italic mt-3 sm:mt-2 leading-tight">
              {rightImage.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const HighlightWord = ({children}:{children:ReactNode}) =>{
  return(
    <span className='text-orange-500 font-bold'>{children}</span>
  )
}

export const componentRegistry = {
  CodeSandbox,
  DownloadableFile,
  Quiz,
  CalloutBox,
  LinkCard,
  EmbeddedVideo,
  ImageGallery,
  Image,
  ComparisonImages,
  HighlightWord
};