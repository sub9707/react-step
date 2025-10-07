import { useParams } from 'react-router-dom';
import CourseList from '../components/CourseListPage/CourseList';
import type { EnglishLevelType, LevelType } from '../types/CourseList';
import { ENGLISH_LEVEL_MAPPINGS } from '../types/CourseList';

const CourseListPage: React.FC = () => {
    const { level } = useParams<{ level: EnglishLevelType }>();
    
    const getLevelName = (id: string): LevelType => {
        return ENGLISH_LEVEL_MAPPINGS[id as EnglishLevelType] || '초급';
    };

    return <CourseList level={getLevelName(level!)} englishLevel={level as EnglishLevelType} />;
};

export default CourseListPage;