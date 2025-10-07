import React from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LearningCard from './LearningCard';
import { useLearningData } from '../../hooks/useLearningData';
import type { LevelType, EnglishLevelType } from '../../types/CourseList';
import { LEVEL_MAPPINGS } from '../../types/CourseList';

interface CourseListProps {
    level?: LevelType;
    englishLevel?: EnglishLevelType;
}

const CourseList: React.FC<CourseListProps> = ({ level = '초급', englishLevel }) => {
    const { data: learningData, loading, error, refetch } = useLearningData(level);
    const navigate = useNavigate();

    const folderName = englishLevel || LEVEL_MAPPINGS[level];

    const handleBackToHome = (): void => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-[#f8f8f8] mb-2">
                        {level} 과정을 불러오는 중...
                    </h3>
                    <p className="text-gray-600 dark:text-[#c2c2c2]">
                        MDX 파일에서 강의 메타데이터를 읽어오고 있습니다.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <button
                        onClick={handleBackToHome}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-[#c2c2c2] hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        단계 선택
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-[#f8f8f8] mb-2">
                        {level} React 과정
                    </h1>
                </div>

                <div className="flex flex-col items-center justify-center py-16">
                    <div className="text-center max-w-md">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#f8f8f8] mb-4">
                            MDX 파일 로드 실패
                        </h2>
                        
                        <p className="text-gray-600 dark:text-[#c2c2c2] mb-2 leading-relaxed">
                            {level} 단계의 강의 파일을 불러올 수 없습니다.
                        </p>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                            <p className="text-red-800 dark:text-red-300 text-sm">
                                <strong>오류:</strong> {error}
                            </p>
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            <p>확인할 경로:</p>
                            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 text-xs">
                                src/assets/contents/courses/{folderName}/lesson-1.mdx
                            </code>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => refetch()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
                            >
                                다시 시도
                            </button>
                            <button
                                onClick={handleBackToHome}
                                className="w-full bg-[#3e3e3e] hover:bg-[#2b2b2b] dark:bg-[#f8f8f8] dark:hover:bg-[#c2c2c2] text-white dark:text-[#2b2b2b] font-medium py-3 px-6 rounded-xl transition-all duration-200"
                            >
                                홈으로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <button
                    onClick={handleBackToHome}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-[#c2c2c2] hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    단계 선택
                </button>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-[#f8f8f8] mb-2">
                    {level} React 과정
                </h1>

                <p className="text-lg text-gray-600 dark:text-[#c2c2c2]">
                    {level === '초급' && 'React의 기초부터 차근차근 배워보세요'}
                    {level === '중급' && 'React의 고급 기능들을 활용해보세요'}
                    {level === '고급' && 'React 전문가로 성장하는 과정입니다'}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    총 {learningData.length}개의 강의가 준비되어 있습니다
                </p>
            </div>

            <div className="space-y-6">
                {learningData.map((item, index) => (
                    <LearningCard
                        key={item.id}
                        item={item}
                        index={index}
                        level={level}
                        englishLevel={folderName}
                    />
                ))}
            </div>

            <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-[#f8f8f8] mb-2">
                        {level} 단계를 완료하셨습니다!
                    </h3>
                    <p className="text-gray-600 dark:text-[#c2c2c2]">
                        {level !== '고급' ? '다음 단계로 이동하여 학습을 진행해보세요.' : '모든 과정을 완료했습니다!'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourseList;