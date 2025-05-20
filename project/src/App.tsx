import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TimetableProvider } from './context/TimetableContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TimetableGeneratorPage from './pages/TimetableGeneratorPage';
import TimetableViewPage from './pages/TimetableViewPage';
import TeachersPage from './pages/TeachersPage';
import SubjectsPage from './pages/SubjectsPage';
import ClassesPage from './pages/ClassesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TimetableProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/generator" element={<TimetableGeneratorPage />} />
              <Route path="/timetable/:id" element={<TimetableViewPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TimetableProvider>
    </AuthProvider>
  );
};

export default App;