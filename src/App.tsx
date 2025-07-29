import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MainPage from './pages/MainPage';
import CourseListPage from './pages/CourseListPage';
import CoursePage from './pages/ContentPage';
import DashboardPage from './pages/DashboardPage';
import { useEffect } from 'react';
import { initGA, trackPageView } from './utils/analytics';

const Analytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // 경로 변경 시마다 페이지뷰 추적
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const App: React.FC = () => {
    useEffect(() => {
    // GA4 초기화
    initGA();
    
    // 초기 페이지뷰 추적
    trackPageView(window.location.pathname + window.location.search);
  }, []);
  return (
    <Routes>
      <Analytics />
      <Route path="/" element={
        <Layout>
          <MainPage />
        </Layout>
      } />
      <Route path="/courses/:level" element={
        <Layout>
          <CourseListPage />
        </Layout>
      } />
      <Route path="/courses/:level/:lessonId" element={
        <Layout>
          <CoursePage />
        </Layout>
      } />
      <Route path="/dashboard" element={
        <Layout>
          <DashboardPage />
        </Layout>
      } />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default App;