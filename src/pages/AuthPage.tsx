import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser } = useAuth();
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header animate-fadeIn">
            <h1>QuizMaster</h1>
            <p>Test your knowledge with interactive quizzes</p>
          </div>
          
          <div className="auth-form-container">
            {isLogin ? (
              <LoginForm onToggleForm={toggleForm} />
            ) : (
              <RegisterForm onToggleForm={toggleForm} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;