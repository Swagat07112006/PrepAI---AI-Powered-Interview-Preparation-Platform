import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layouts/app-layout';
import { LoadingState } from '@/components/common/state-views';

const LandingPage = lazy(() => import('@/pages/landing-page').then((module) => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/pages/login-page').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/register-page').then((module) => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import('@/pages/dashboard-page').then((module) => ({ default: module.DashboardPage })));
const QuestionsPage = lazy(() => import('@/pages/questions-page').then((module) => ({ default: module.QuestionsPage })));
const QuestionDetailPage = lazy(() => import('@/pages/question-detail-page').then((module) => ({ default: module.QuestionDetailPage })));
const NotesPage = lazy(() => import('@/pages/notes-page').then((module) => ({ default: module.NotesPage })));
const NoteDetailPage = lazy(() => import('@/pages/note-detail-page').then((module) => ({ default: module.NoteDetailPage })));
const RevisionsPage = lazy(() => import('@/pages/revisions-page').then((module) => ({ default: module.RevisionsPage })));
const ProfilePage = lazy(() => import('@/pages/profile-page').then((module) => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/settings-page').then((module) => ({ default: module.SettingsPage })));
const FutureAiPage = lazy(() => import('@/pages/future-ai-page').then((module) => ({ default: module.FutureAiPage })));
const NotFoundPage = lazy(() => import('@/pages/not-found-page').then((module) => ({ default: module.NotFoundPage })));
const LoadingPage = lazy(() => import('@/pages/loading-page').then((module) => ({ default: module.LoadingPage })));

function ProtectedRoute({ children }) {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  if (isCheckingAuth) {
    return <LoadingState title="Restoring your workspace" description="Checking your PrepAI session and loading personalized data." />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  if (isCheckingAuth) {
    return <LoadingPage />;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingPage />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><AppLayout><QuestionsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/questions/:id" element={<ProtectedRoute><AppLayout><QuestionDetailPage /></AppLayout></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><AppLayout><NotesPage /></AppLayout></ProtectedRoute>} />
          <Route path="/notes/:id" element={<ProtectedRoute><AppLayout><NoteDetailPage /></AppLayout></ProtectedRoute>} />
          <Route path="/revisions" element={<ProtectedRoute><AppLayout><RevisionsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/:slug" element={<ProtectedRoute><AppLayout><FutureAiPage /></AppLayout></ProtectedRoute>} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}