import { useParams } from 'react-router-dom';
import CourseList from '../components/CourseListPage/CourseList';

const CourseListPage: React.FC = () => {
    const { level } = useParams<{ level: string }>();
    
    // id를 한국어 레벨명으로 변환
    const getLevelName = (id: string): '초급' | '중급' | '고급' => {
        const levelMap: Record<string, '초급' | '중급' | '고급'> = {
            'beginner': '초급',
            'intermediate': '중급', 
            'advanced': '고급'
        };
        return levelMap[id] || '초급';
    };

    return <CourseList level={getLevelName(level || 'beginner')} />;
};

export default CourseListPage;