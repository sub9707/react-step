import { useState, useEffect } from 'react';
import { generateLearningData } from '../components/CourseListPage/generateLearningData';
import type { LearningItem, LevelType } from '../types/CourseList';

export const useLearningData = (level: LevelType) => {
  const [data, setData] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const learningData = await generateLearningData(level);
        setData(learningData);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `${level} 데이터 로드 실패`;
        setError(errorMessage);
        console.error('Failed to load learning data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [level]);

  const refetch = async () => {
    try {
      setError(null);
      const learningData = await generateLearningData(level);
      setData(learningData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터 다시 로드 실패';
      setError(errorMessage);
    }
  };

  return { data, loading, error, refetch };
};