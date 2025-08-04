import { BookOpen, Star } from "lucide-react";
import type { LearningItem } from "../../types/CourseList";
import { useNavigate } from "react-router-dom";

// 학습 카드 컴포넌트
interface LearningCardProps {
    item: LearningItem;
    index: number;
    level: string;
}

const LearningCard: React.FC<LearningCardProps> = ({ item, index, level }) => {
    const navigate = useNavigate();
    const getDifficultyColor = (difficulty: LearningItem['difficulty']): string => {
        switch (difficulty) {
            case '쉬움': return 'text-green-500';
            case '보통': return 'text-yellow-500';
            case '어려움': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const handleStartLearning = () => {
        navigate(`/courses/${level}/${item.id}`);
    }

    // 제목 클릭 핸들러 추가
    const handleTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleStartLearning();
    }

    return (
        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-[#3e3e3e]">
            {/* 배경 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>

            <div className="relative bg-white dark:bg-[#2b2b2b] p-6 h-full">
                {/* 순서 번호 */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                    {index + 1}
                </div>

                {/* 이미지 - 모바일에서 위아래 공백 제거 */}
                <div className="mb-2 mt-6 sm:mb-4 sm:mt-12 overflow-hidden rounded-xl h-48 sm:h-80 flex items-center justify-center">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                {/* 메타 정보 */}
                <div className="flex items-center justify-end mb-3">
                    <div className={`flex items-center gap-1 text-sm font-medium ${getDifficultyColor(item.difficulty)}`}>
                        <Star className="w-4 h-4" />
                        <span>{item.difficulty}</span>
                    </div>
                </div>

                {/* 텍스트, 버튼 영역 */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* 제목 설명 */}
                    <div className="flex-1">
                        {/* 클릭 가능한 제목 */}
                        <h3 
                            className="text-xl font-bold text-gray-900 dark:text-[#f8f8f8] mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer hover:underline"
                            onClick={handleTitleClick}
                        >
                            {item.title}
                        </h3>

                        <p className="text-gray-600 dark:text-[#c2c2c2] leading-relaxed text-sm mb-2">
                            {item.description}
                        </p>
                    </div>

                    {/* 학습 시작 버튼 */}
                    <div className="flex-shrink-0 flex items-center">
                        <button className=
                            "bg-[#3e3e3e] hover:bg-[#2b2b2b] dark:bg-[#f8f8f8] dark:hover:bg-[#c2c2c2] text-white dark:text-[#2b2b2b] font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg whitespace-nowrap cursor-pointer w-full sm:w-auto"
                            onClick={handleStartLearning}
                        >
                            <BookOpen className="w-4 h-4" />
                            학습 시작하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningCard