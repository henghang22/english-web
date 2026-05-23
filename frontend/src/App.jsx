import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import GuestLayout from './layouts/GuestLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonViewPage from './pages/LessonViewPage';
import QuizViewPage from './pages/QuizViewPage';
import DashboardPage from './pages/DashboardPage';
import MyCoursesPage from './pages/MyCoursesPage';
import AdminStatsPage from './pages/admin/AdminStatsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminLessonsPage from './pages/admin/AdminLessonsPage';
import AdminQuizPage from './pages/admin/AdminQuizPage';
import AdminAllQuizzesPage from './pages/admin/AdminAllQuizzesPage';
import AdminQuizResultsPage from './pages/admin/AdminQuizResultsPage';
import AIChatPage from './pages/AIChatPage';
import { Toaster } from 'react-hot-toast';

// Teacher Pages
import TeacherLayout from './layouts/TeacherLayout';
import TeacherCoursesPage from './pages/teacher/TeacherCoursesPage';
import TeacherLessonsPage from './pages/teacher/TeacherLessonsPage';
import TeacherQuizPage from './pages/teacher/TeacherQuizPage';
import TeacherQuizzesPage from './pages/teacher/TeacherQuizzesPage';
import TeacherQuizResultsPage from './pages/teacher/TeacherQuizResultsPage';
import TeacherStatsPage from './pages/teacher/TeacherStatsPage';



// Components
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/lessons/:id" element={<LessonViewPage />} />
          <Route path="/lessons/:lessonId/quiz" element={<QuizViewPage />} />
          <Route path="/courses/:courseId/quiz" element={<QuizViewPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<Navigate to="/admin/stats" />} />
          <Route path="/admin/stats" element={<AdminStatsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/courses/:courseId/lessons" element={<AdminLessonsPage />} />
          <Route path="/admin/courses/:courseId/quiz" element={<AdminQuizPage />} />
          <Route path="/admin/quizzes" element={<AdminAllQuizzesPage />} />
          <Route path="/admin/quiz-results" element={<AdminQuizResultsPage />} />
          <Route path="/admin/lessons/:lessonId/quiz" element={<AdminQuizPage />} />
          <Route path="/admin/settings" element={<div className="text-2xl font-bold">Cài đặt hệ thống</div>} />
        </Route>

        {/* Teacher Protected Routes */}
        <Route element={<ProtectedRoute roles={['teacher']}><TeacherLayout /></ProtectedRoute>}>
          <Route path="/teacher" element={<Navigate to="/teacher/stats" />} />
          <Route path="/teacher/stats" element={<TeacherStatsPage />} />
          <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
          <Route path="/teacher/courses/:courseId/lessons" element={<TeacherLessonsPage />} />
          <Route path="/teacher/courses/:courseId/quiz" element={<TeacherQuizPage />} />
          <Route path="/teacher/lessons/:lessonId/quiz" element={<TeacherQuizPage />} />
          <Route path="/teacher/quizzes" element={<TeacherQuizzesPage />} />
          <Route path="/teacher/quiz-results" element={<TeacherQuizResultsPage />} />
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
