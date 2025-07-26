import { ArrowLeft, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useMDXContent, getAvailableLessons } from '../hooks/useMDXContent';
import NavigationBar from '../components/CourseContent/NavigationBar';
import MDXRenderer from '../components/CourseContent/MDXRenderer';
import { componentRegistry } from '../components/CourseContent/EmbeddedComponents';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';

interface ContentPageProps {
  level?: string;
}

function ContentPage({ level = 'beginner'}: ContentPageProps) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { MDXComponent, metadata, loading, error } = useMDXContent(level, lessonId!);
  const navigate = useNavigate();
  
  // 사용 가능한 레슨 목록 가져오기
  const availableLessons = getAvailableLessons(level);
  const currentLessonNum = parseInt(lessonId!);
  const currentIndex = availableLessons.indexOf(currentLessonNum);
  
  const hasPrevLesson = currentIndex > 0;
  const hasNextLesson = currentIndex < availableLessons.length - 1;
  
  const prevLessonNum = hasPrevLesson ? availableLessons[currentIndex - 1] : null;
  const nextLessonNum = hasNextLesson ? availableLessons[currentIndex + 1] : null;

  const handleBackToList = () => {
    navigate(`/courses/${level}`);
  };

  const handlePrevLesson = () => {
    if (prevLessonNum) {
      navigate(`/courses/${level}/${prevLessonNum}`);
    }
  };

  const handleNextLesson = () => {
    if (nextLessonNum) {
      navigate(`/courses/${level}/${nextLessonNum}`);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] dark:bg-[#1d1d1d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-[#f8f8f8] mb-2">
              학습 콘텐츠를 불러오는 중...
            </h3>
            <p className="text-gray-600 dark:text-[#c2c2c2]">
              잠시만 기다려주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !MDXComponent) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] dark:bg-[#1d1d1d] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#f8f8f8] mb-4">
            콘텐츠를 불러올 수 없습니다
          </h2>

          <p className="text-gray-600 dark:text-[#c2c2c2] mb-6 leading-relaxed">
            {error || '요청한 학습 콘텐츠를 찾을 수 없습니다. 다른 강의를 선택하거나 잠시 후 다시 시도해주세요.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleBackToList}
              className="w-full bg-[#3e3e3e] hover:bg-[#2b2b2b] dark:bg-[#f8f8f8] dark:hover:bg-[#c2c2c2] text-white dark:text-[#2b2b2b] font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로 돌아가기
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-[#3e3e3e] dark:hover:bg-[#2b2b2b] text-gray-700 dark:text-[#c2c2c2] font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 제목 생성 (메타데이터에서 가져오거나 기본값 사용)
  const title = metadata?.title || `Lesson ${lessonId}`;

  // 성공적으로 데이터를 불러온 경우
  return (
    <div className="min-h-screen bg-[#f8f8f8] dark:bg-[#1d1d1d] transition-colors duration-200">
      {/* 마크다운 네비게이션 - MDX 컴포넌트에서 헤딩 추출 */}
      <NavigationBar MDXComponent={MDXComponent} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 상단 네비게이션 */}
        <div className="mb-8">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-[#c2c2c2] hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            목록으로
          </button>

          {/* 메타데이터가 있으면 표시 */}
          {metadata && Object.keys(metadata).length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {metadata.difficulty && (
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    난이도: {metadata.difficulty}
                  </span>
                )}
                {metadata.duration && (
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                    소요시간: {metadata.duration}
                  </span>
                )}
                {metadata.tags && metadata.tags.length > 0 && (
                  <>
                    {metadata.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </>
                )}
                {metadata.author && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 rounded-full">
                    작성자: {metadata.author}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 모바일에서 제목 크기 줄임 */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-[#f8f8f8] mb-2">
            {title}
          </h1>

          {metadata?.description && (
            <p className="text-lg text-gray-600 dark:text-[#c2c2c2] mt-2">
              {metadata.description}
            </p>
          )}

          {metadata?.lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              마지막 업데이트: {metadata.lastUpdated}
            </p>
          )}
        </div>

        {/* MDX 콘텐츠 - 모바일에서 좌우 여백 줄임 */}
        <div className="bg-white dark:bg-[#2b2b2b] rounded-xl border border-gray-200 dark:border-[#3e3e3e] overflow-hidden shadow-lg">
          <div className="px-4 sm:px-12 py-6">
            <MDXRenderer
              components={componentRegistry}
              className="dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100"
            >
              <MDXComponent />
            </MDXRenderer>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* 목록으로 돌아가기 버튼 */}
          <button
            onClick={handleBackToList}
            className="text-gray-600 dark:text-[#c2c2c2] hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer transition-colors"
          >
            목록으로
          </button>

          {/* 이전/다음 강의 버튼 */}
          <div className="flex gap-3">
            {/* 이전 강의 버튼 */}
            {hasPrevLesson && (
              <Button 
                variant="primary" 
                onClick={handlePrevLesson} 
                size="md"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                이전 강의
              </Button>
            )}

            {/* 다음 강의 버튼 */}
            {hasNextLesson && (
              <Button 
                variant="primary" 
                onClick={handleNextLesson} 
                size="md"
                className="flex items-center gap-2"
              >
                다음 강의
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentPage;