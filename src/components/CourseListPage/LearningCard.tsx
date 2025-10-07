import { BookOpen, Star } from "lucide-react";
import type { LearningItem, LevelType, EnglishLevelType } from "../../types/CourseList";
import { useNavigate } from "react-router-dom";

interface LearningCardProps {
    item: LearningItem;
    index: number;
    level: LevelType;
    englishLevel: EnglishLevelType;
}

const LearningCard: React.FC<LearningCardProps> = ({ item, index, level, englishLevel }) => {
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
        navigate(`/courses/${englishLevel}/${item.id}`);
    };

    const handleTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleStartLearning();
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-[#3e3e3e]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>

            <div className="relative bg-white dark:bg-[#2b2b2b] p-6 h-full">
                <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                    {index + 1}
                </div>

                <div className="mb-2 mt-6 sm:mb-4 sm:mt-12 overflow-hidden rounded-xl h-48 sm:h-80 flex items-center justify-center">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <div className="flex items-center justify-end mb-3">
                    <div className={`flex items-center gap-1 text-sm font-medium ${getDifficultyColor(item.difficulty)}`}>
                        <Star className="w-4 h-4" />
                        <span>{item.difficulty}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <h3 
                            onClick={handleTitleClick}
                            className="text-xl font-bold text-gray-900 dark:text-[#f8f8f8] mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-[#c2c2c2] text-sm mb-3">
                            {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags.map((tag, tagIndex) => (
                                <span
                                    key={tagIndex}
                                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex sm:flex-col gap-3 sm:justify-center">
                        <button
                            onClick={handleStartLearning}
                            className="flex-1 sm:flex-none bg-gray-800 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>학습하기</span>
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#3e3e3e]">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>최근 업데이트: {item.lastUpdated}</span>
                        {item.duration && <span>{item.duration}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningCard;