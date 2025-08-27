import React, { useState, useEffect } from 'react';

// 메모리 기반 인증 상태 관리
interface AuthState {
  isAuthenticated: boolean;
  authTime: number | null;
}

// 전역 인증 상태 (메모리에 저장)
let globalAuthState: AuthState = {
  isAuthenticated: false,
  authTime: null
};

const DashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const DASHBOARD_KEY = import.meta.env.VITE_DASHBOARD_PASSWORD || 'admin123';

  // 인증 상태 확인 함수
  const checkAuthStatus = () => {
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24시간을 밀리초로

    if (globalAuthState.isAuthenticated && globalAuthState.authTime) {
      // 인증된 지 24시간이 지났는지 확인
      if (now - globalAuthState.authTime < ONE_DAY) {
        return true;
      } else {
        // 24시간이 지났으면 인증 해제
        globalAuthState.isAuthenticated = false;
        globalAuthState.authTime = null;
        return false;
      }
    }
    return false;
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const isAuth = checkAuthStatus();
    setIsAuthenticated(isAuth);
    setLoading(false);
  }, []);

  // 로그인 처리 함수
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === DASHBOARD_KEY) {
      // 인증 성공
      globalAuthState.isAuthenticated = true;
      globalAuthState.authTime = Date.now();
      setIsAuthenticated(true);
      setPassword('');
    } else {
      // 인증 실패
      setError('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    globalAuthState.isAuthenticated = false;
    globalAuthState.authTime = null;
    setIsAuthenticated(false);
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-1 dark:bg-dark-4">
        <div className="text-light-4 dark:text-light-2">
          로딩 중...
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 폼 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-1 dark:bg-dark-3 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-dark-2 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-4 dark:text-light-1 mb-2">
                Dashboard
              </h2>
              <p className="text-light-4 dark:text-light-3">
                대시보드에 접근하려면 비밀번호를 입력하세요.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-3 border border-light-2 dark:border-dark-1 
                           bg-white dark:bg-dark-3 
                           text-dark-4 dark:text-light-1
                           placeholder-light-3 dark:placeholder-light-4
                           rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-colors duration-200"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm text-center px-3">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-dark-4 hover:bg-dark-2 dark:bg-light-1 dark:hover:bg-light-3
                         text-white dark:text-dark-4 font-medium py-3 px-4 rounded-lg 
                         transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         dark:focus:ring-offset-dark-2 cursor-pointer"
              >
                로그인
              </button>
            </form>
            
            <p className="text-xs text-light-3 dark:text-light-4 text-center mt-6">
              * 인증은 24시간 동안 유효합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 인증된 경우 대시보드 내용 표시
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark-4 dark:text-light-1">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600
                     text-white rounded-lg transition-colors duration-200 
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                     dark:focus:ring-offset-dark-4"
          >
            로그아웃
          </button>
        </div>

        {/* 대시보드 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-2 rounded-lg shadow-md 
                         border border-light-2 dark:border-dark-1 p-6
                         hover:shadow-lg transition-shadow duration-200">
            <h4 className="text-lg font-semibold text-dark-4 dark:text-light-1 mb-3">
              통계
            </h4>
            <p className="text-light-4 dark:text-light-3">
              여기에 통계 정보를 표시할 수 있습니다.
            </p>
          </div>
          
          <div className="bg-white dark:bg-dark-2 rounded-lg shadow-md 
                         border border-light-2 dark:border-dark-1 p-6
                         hover:shadow-lg transition-shadow duration-200">
            <h4 className="text-lg font-semibold text-dark-4 dark:text-light-1 mb-3">
              관리
            </h4>
            <p className="text-light-4 dark:text-light-3">
              여기에 관리 기능을 추가할 수 있습니다.
            </p>
          </div>
          
          <div className="bg-white dark:bg-dark-2 rounded-lg shadow-md 
                         border border-light-2 dark:border-dark-1 p-6
                         hover:shadow-lg transition-shadow duration-200">
            <h4 className="text-lg font-semibold text-dark-4 dark:text-light-1 mb-3">
              설정
            </h4>
            <p className="text-light-4 dark:text-light-3">
              여기에 설정 옵션을 추가할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;