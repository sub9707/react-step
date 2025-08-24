import React from 'react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div className="flex min-h-[80vh] items-center justify-center text-gray-100">
      <div className="mx-4 max-w-lg p-8 text-center">
        <img className="mb-8 " src='src/assets/images/react_notfound.png' alt="404 Not Found" />
        <h2 className="mb-8 text-4xl font-semibold text-dark-2 dark:text-light-1">페이지를 찾을 수 없습니다</h2>
        <p className="mb-8 text-lg text-gray-400">
          아마도 없는 페이지에 접근하신 것 같아요..<br />
          아래 연락처로 문의주시겠어요?
        </p>
        <Button
          onClick={handleGoBack}
          className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          이전 페이지로
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;