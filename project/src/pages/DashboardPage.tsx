import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { Navigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import QuizCard from '../components/quiz/QuizCard';
import Leaderboard from '../components/leaderboard/Leaderboard';
import { BarChart2, Award, FileText, User, LogOut } from 'lucide-react';
import { mockUsers } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { allQuizzes, quizResults, setCurrentQuiz } = useQuiz();
  const [activeTab, setActiveTab] = useState('quizzes');
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  const userResults = quizResults.filter(result => result.userId === currentUser.id);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const getQuizNameById = (quizId: string) => {
    const quiz = allQuizzes.find(q => q.id === quizId);
    return quiz?.title || 'Unknown Quiz';
  };
  
  const handleStartQuiz = (quiz: any) => {
    setCurrentQuiz(quiz);
    window.location.href = '/quiz';
  };
  
  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-welcome animate-fadeIn">
            <h1>Hello, {currentUser.username}!</h1>
            <p>Welcome to your dashboard. Ready to challenge yourself today?</p>
          </div>
          
          <div className="user-actions animate-fadeIn">
            <Button
              variant="outline"
              onClick={logout}
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
        
        <div className="dashboard-tabs animate-fadeIn">
          <button 
            className={`tab-item ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <FileText size={18} /> Available Quizzes
          </button>
          <button 
            className={`tab-item ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            <BarChart2 size={18} /> My Results
          </button>
          <button 
            className={`tab-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Award size={18} /> Leaderboard
          </button>
          <button 
            className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> My Profile
          </button>
        </div>
        
        <div className="dashboard-content">
          {activeTab === 'quizzes' && (
            <div className="quizzes-tab animate-fadeIn">
              <h2>Available Quizzes</h2>
              <div className="quizzes-grid row">
                {allQuizzes.map(quiz => (
                  <div key={quiz.id} className="col col-sm-12 col-md-6 col-lg-4">
                    <QuizCard
                      quiz={quiz}
                      onStartQuiz={handleStartQuiz}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'results' && (
            <div className="results-tab animate-fadeIn">
              <h2>My Quiz Results</h2>
              
              {userResults.length > 0 ? (
                <div className="results-list">
                  {userResults.map(result => (
                    <Card key={result.id} className="result-card">
                      <CardContent>
                        <div className="result-info">
                          <div className="result-header">
                            <h3>{getQuizNameById(result.quizId)}</h3>
                            <span className="result-date">{formatDate(result.completedAt)}</span>
                          </div>
                          
                          <div className="result-details">
                            <div className="result-score">
                              <span className="result-label">Score:</span>
                              <span className="result-value">{result.score} / {result.maxScore}</span>
                              <span className="result-percentage">
                                ({Math.round((result.score / result.maxScore) * 100)}%)
                              </span>
                            </div>
                            
                            <div className="result-time">
                              <span className="result-label">Time:</span>
                              <span className="result-value">
                                {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>You haven't completed any quizzes yet.</p>
                  <Button 
                    variant="primary"
                    onClick={() => setActiveTab('quizzes')}
                  >
                    Browse Quizzes
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'leaderboard' && (
            <div className="leaderboard-tab animate-fadeIn">
              <Leaderboard
                quizResults={quizResults}
                users={mockUsers}
                quizzes={allQuizzes}
              />
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="profile-tab animate-fadeIn">
              <Card>
                <CardHeader>
                  <h2>My Profile</h2>
                </CardHeader>
                <CardContent>
                  <div className="profile-info">
                    <div className="profile-avatar">
                      <div className="avatar-placeholder">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="profile-details">
                      <div className="profile-item">
                        <span className="profile-label">Username:</span>
                        <span className="profile-value">{currentUser.username}</span>
                      </div>
                      
                      <div className="profile-item">
                        <span className="profile-label">Email:</span>
                        <span className="profile-value">{currentUser.email}</span>
                      </div>
                      
                      <div className="profile-item">
                        <span className="profile-label">Quizzes Completed:</span>
                        <span className="profile-value">{userResults.length}</span>
                      </div>
                      
                      <div className="profile-item">
                        <span className="profile-label">Average Score:</span>
                        <span className="profile-value">
                          {userResults.length > 0
                            ? Math.round(
                                (userResults.reduce(
                                  (sum, result) => sum + (result.score / result.maxScore * 100),
                                  0
                                ) / userResults.length)
                              ) + '%'
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;