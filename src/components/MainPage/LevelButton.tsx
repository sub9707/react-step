import { useNavigate } from 'react-router-dom';
import Button from '../common/Button'
import StepBars from '../common/StepBars'

export interface levelDataProps {
    id: string,
    title: string,
    level: number,
    description: string,
    features: string[]
}

function LevelButton({ id, title, description, level, features }: levelDataProps) {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate(`/courses/${id}`);
    };
    return (
        <div key={id} className="text-center">
            <div className="bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-shadow duration-300 dark:bg-dark-2 dark:shadow-xl">
                <div className="flex items-center justify-center gap-3 text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {title}
                    <StepBars level={level} />
                </div>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    {description}
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">주요 학습 내용</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {features.map((feature, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 dark:bg-dark-4 dark:text-gray-200"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                <Button variant="primary" size="lg" className="w-full focus:ring-blue-500" onClick={handleStart}>
                    시작하기
                </Button>
            </div>
        </div>
    )
}

export default LevelButton