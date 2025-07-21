import React, { useRef, useState, type ReactNode } from 'react';
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

// 인터랙티브 코드 샌드박스
export const CodeSandbox: React.FC<EmbeddedComponentProps> = ({ 
  code, 
  language = 'javascript', 
  title = 'Code Example',
  editable = false 
}) => {
  const [currentCode, setCurrentCode] = useState(code || '');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false); // 실행 여부 추가
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 코드 포맷팅 함수
  const formatCode = (code: string) => {
    let formatted = code;
    let indentLevel = 0;
    const lines = formatted.split('\n');
    
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // 닫는 괄호나 중괄호가 있으면 들여쓰기 감소
      if (trimmed.includes('}') || trimmed.includes(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = '  '.repeat(indentLevel) + trimmed;
      
      // 여는 괄호나 중괄호가 있으면 들여쓰기 증가
      if (trimmed.includes('{') || trimmed.includes('(')) {
        indentLevel++;
      }
      
      return indentedLine;
    });
    
    return formattedLines.join('\n');
  };

  // React 코드인지 확인
  const isReactCode = currentCode.includes('function ') && 
                     (currentCode.includes('<') || currentCode.includes('return ('));

  const runReactCode = () => {
    if (!iframeRef.current) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      margin: 20px; 
      background: white;
    }
    button {
      padding: 8px 16px;
      margin: 4px;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }
    h3 { color: #333; margin-top: 0; }
    p { color: #666; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    ${currentCode}
    
    // App 컴포넌트가 있으면 렌더링
    if (typeof App !== 'undefined') {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    } else {
      document.getElementById('root').innerHTML = '<p style="color: red;">App 컴포넌트를 찾을 수 없습니다.</p>';
    }
  </script>
</body>
</html>`;

    const iframe = iframeRef.current;
    iframe.srcdoc = htmlContent;
  };

  const runJavaScript = () => {
    try {
      const result = new Function(currentCode)();
      setOutput(String(result || 'Code executed successfully'));
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  const runCode = () => {
    setIsLoading(true);
    setOutput('');
    setHasExecuted(true); // 실행했음을 표시
    
    setTimeout(() => {
      if (isReactCode) {
        runReactCode();
      } else {
        runJavaScript();
      }
      setIsLoading(false);
    }, 100);
  };

  // 코드 표시용 (읽기 전용일 때 포맷팅 적용)
  const displayCode = editable ? currentCode : formatCode(currentCode);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden my-6">
      {/* 헤더 */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            {isReactCode ? 'React JSX' : language}
          </span>
          {editable && (
            <button
              onClick={runCode}
              disabled={isLoading}
              className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 rounded transition-colors"
            >
              <Play className="w-3 h-3" />
              {isLoading ? '실행중...' : '실행'}
            </button>
          )}
        </div>
      </div>
      
      {/* 코드 에디터 */}
      {editable ? (
        <textarea
          value={currentCode}
          onChange={(e) => setCurrentCode(e.target.value)}
          className="w-full h-40 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-none resize-y focus:outline-none"
          spellCheck={false}
          placeholder="코드를 입력하세요..."
          style={{ 
            tabSize: 2,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
          }}
        />
      ) : (
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm overflow-x-auto">
          <code style={{ 
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            lineHeight: '1.5'
          }}>
            {displayCode}
          </code>
        </pre>
      )}
      
      {/* 결과 출력 - 실행했을 때만 표시 */}
      {hasExecuted && (
        <>
          {isReactCode ? (
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                실행 결과:
              </div>
              <iframe
                ref={iframeRef}
                className="w-full h-64 border-none"
                title="React 실행 결과"
              />
            </div>
          ) : (
            output && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Output:</div>
                <pre className="text-sm text-gray-800 dark:text-gray-200">{output}</pre>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

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

// 알림 박스 컴포넌트 (기존 것을 개선)
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
    <div className={`${style.bg} ${style.border} ${style.text} border-l-4 p-4 my-6 rounded-r-lg`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-2">{title}</h4>
          )}
          <div>{children}</div>
        </div>
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
}

// 이미지 갤러리 컴포넌트
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  width = 'full',
  borderRadius = 'lg',
  shadow = true,
  border = false
}) => {
  const isSingleImage = images.length === 1;
  
  const borderRadiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }[borderRadius];

  // 너비 클래스 매핑
  const widthClass = {
    full: 'w-full',
    half: 'w-1/2',
    third: 'w-1/3',
    quarter: 'w-1/4',
    'two-thirds': 'w-2/3'
  }[width];

  const containerClass = isSingleImage 
    ? `${widthClass} mx-auto` 
    : `flex flex-wrap justify-center gap-4 ${widthClass} mx-auto`;

  const imageWrapperClass = isSingleImage
    ? 'w-full'
    : 'flex-1 min-w-0 max-w-sm';

  return (
    <div className="my-8 w-full flex justify-center">
      <div className={containerClass}>
        <div className={isSingleImage ? 'w-full' : 'flex flex-wrap justify-center gap-4 w-full'}>
          {images.map((image, index) => (
            <div key={index} className={imageWrapperClass}>
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
              </div>
              
              {/* 이미지 설명 텍스트 */}
              {image.caption && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic mt-3 px-2">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 단일 이미지를 위한 편의 컴포넌트
export const Image: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  width?: ImageWidth;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: boolean;
  border?: boolean;
}> = ({ src, alt, caption, ...props }) => {
  return (
    <ImageGallery
      images={[{ src, alt, caption }]}
      {...props}
    />
  );
};

// 비교 이미지 컴포넌트 (Before/After 등)
export const ComparisonImages: React.FC<{
  leftImage: ImageItem;
  rightImage: ImageItem;
  labels?: { left: string; right: string };
}> = ({ leftImage, rightImage, labels }) => {
  return (
    <div className="my-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          {labels?.left && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              {labels.left}
            </div>
          )}
          <img
            src={leftImage.src}
            alt={leftImage.alt}
            className="w-full h-auto object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          />
          {leftImage.caption && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic mt-3">
              {leftImage.caption}
            </p>
          )}
        </div>
        
        <div className="relative">
          {labels?.right && (
            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              {labels.right}
            </div>
          )}
          <img
            src={rightImage.src}
            alt={rightImage.alt}
            className="w-full h-auto object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          />
          {rightImage.caption && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic mt-3">
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