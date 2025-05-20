import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import QuizCreator from '../components/admin/QuizCreator';
import { mockUsers } from '../data/mockData';
import { PlusCircle, Edit, Trash2, Users, FileText } from 'lucide-react';
import { Quiz } from '../types';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { allQuizzes, loadQuizzes } = useQuiz();
  const [activeTab, setActiveTab] = useState('quizzes');
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>(undefined);
  
  // Redirect if not logged in or not admin
  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSaveQuiz = (quiz: Omit<Quiz, 'id'>) => {
    // In a real app, this would save to a backend
    // For now, we'll just log the quiz and reset the state
    console.log('Saving quiz:', quiz);
    
    setTimeout(() => {
      // Simulate successful save
      setIsCreatingQuiz(false);
      setEditingQuiz(undefined);
      // Refresh quizzes
      loadQuizzes();
      alert('Quiz saved successfully!');
    }, 1000);
  };
  
  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsCreatingQuiz(true);
  };
  
  const handleDeleteQuiz = (quizId: string) => {
    // In a real app, this would call an API to delete the quiz
    if (confirm('Are you sure you want to delete this quiz?')) {
      console.log('Deleting quiz:', quizId);
      
      setTimeout(() => {
        // Simulate successful delete
        loadQuizzes();
        alert('Quiz deleted successfully!');
      }, 1000);
    }
  };
  
  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header animate-fadeIn">
          <h1>Admin Dashboard</h1>
          <p>Manage quizzes, users, and system settings</p>
        </div>
        
        <div className="admin-tabs animate-fadeIn">
          <button 
            className={`tab-item ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <FileText size={18} /> Quizzes
          </button>
          <button 
            className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Users
          </button>
        </div>
        
        <div className="admin-content">
          {activeTab === 'quizzes' && !isCreatingQuiz && (
            <div className="quizzes-management animate-fadeIn">
              <div className="section-header">
                <h2>Manage Quizzes</h2>
                <Button 
                  variant="primary"
                  onClick={() => setIsCreatingQuiz(true)}
                >
                  <PlusCircle size={16} /> Create New Quiz
                </Button>
              </div>
              
              {allQuizzes.length > 0 ? (
                <div className="quizzes-list">
                  {allQuizzes.map(quiz => (
                    <Card key={quiz.id} className="quiz-item">
                      <CardContent>
                        <div className="quiz-details">
                          <div className="quiz-info">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <div className="quiz-meta">
                              <span>{quiz.timeLimit} minutes</span>
                              <span>{quiz.questions.length} questions</span>
                              <span>
                                {quiz.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="quiz-actions">
                            <Button 
                              variant="outline"
                              onClick={() => handleEditQuiz(quiz)}
                            >
                              <Edit size={16} /> Edit
                            </Button>
                            <Button 
                              variant="danger"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                            >
                              <Trash2 size={16} /> Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="no-quizzes">
                  <p>No quizzes have been created yet.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'quizzes' && isCreatingQuiz && (
            <div className="quiz-creator-container animate-fadeIn">
              <div className="section-header">
                <h2>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsCreatingQuiz(false);
                    setEditingQuiz(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
              
              <QuizCreator
                onSaveQuiz={handleSaveQuiz}
                editingQuiz={editingQuiz}
              />
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="users-management animate-fadeIn">
              <div className="section-header">
                <h2>Manage Users</h2>
              </div>
              
              <div className="users-list">
                {mockUsers.map(user => (
                  <Card key={user.id} className="user-item">
                    <CardContent>
                      <div className="user-details">
                        <div className="user-info">
                          <h3>{user.username}</h3>
                          <p>{user.email}</p>
                          <span className={`user-role ${user.isAdmin ? 'admin' : 'user'}`}>
                            {user.isAdmin ? 'Administrator' : 'User'}
                          </span>
                        </div>
                        
                        <div className="user-actions">
                          <Button 
                            variant="outline"
                          >
                            <Edit size={16} /> Edit
                          </Button>
                          {!user.isAdmin && (
                            <Button 
                              variant="danger"
                            >
                              <Trash2 size={16} /> Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;