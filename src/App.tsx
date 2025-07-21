import './App.css'
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MainPage from './pages/MainPage';
import CourseListPage from './pages/CourseListPage';
import CoursePage from './pages/ContentPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <MainPage />
          </Layout>
        }
      />
      <Route
        path="/courses/:level"
        element={
          <Layout>
            <CourseListPage />
          </Layout>
        }
      />
      <Route
        path="/courses/:level/:lessonId"
        element={
          <Layout>
            <CoursePage />
          </Layout>
        }
      />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default App;