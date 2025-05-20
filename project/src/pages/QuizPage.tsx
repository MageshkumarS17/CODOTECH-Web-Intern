import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizResults from '../components/quiz/QuizResults';
import Button from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

const QuizPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    currentQuiz, 
    activeQuestion, 
    answers, 
    timeRemaining,
    quizInProgress, 
    quizCompleted,
    startQuiz, 
    endQuiz, 
    nextQuestion, 
    prevQuestion, 
    selectAnswer, 
    submitQuiz,
    resetQuizState,
    quizResults
  } = useQuiz();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect if no quiz is selected
  if (!currentQuiz) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleStartQuiz = () => {
    setShowInstructions(false);
    startQuiz();
  };
  
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuiz) return;
    selectAnswer(currentQuiz.questions[activeQuestion].id, optionIndex);
  };
  
  const handleSubmitQuiz = () => {
    submitQuiz();
  };
  
  const handleBackToQuizzes = () => {
    resetQuizState();
    navigate('/dashboard');
  };
  
  const handleRetakeQuiz = () => {
    // Reset quiz state but keep the same quiz
    const quiz = {...currentQuiz};
    resetQuizState();
    setTimeout(() => {
      useQuiz().setCurrentQuiz(quiz);
      setShowInstructions(true);
    }, 100);
  };
  
  const currentQuestion = currentQuiz.questions[activeQuestion];
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isLastQuestion = activeQuestion === currentQuiz.questions.length - 1;
  const isFirstQuestion = activeQuestion === 0;
  
  // Get the most recent result for this quiz
  const currentResult = quizCompleted ? 
    quizResults.find(result => 
      result.quizId === currentQuiz.id && 
      result.userId === currentUser.id
    ) : null;
  
  if (quizCompleted && currentResult) {
    return (
      <QuizResults
        result={currentResult}
        quiz={currentQuiz}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToQuizzes={handleBackToQuizzes}
      />
    );
  }
  
  return (
    <div className="quiz-page">
      <div className="container">
        {showInstructions ? (
          <Card className="quiz-instructions animate-fadeIn">
            <CardHeader>
              <h2>{currentQuiz.title}</h2>
            </CardHeader>
            <CardContent>
              <div className="quiz-description">
                <p>{currentQuiz.description}</p>
              </div>
              
              <div className="quiz-meta">
                <div className="quiz-meta-item">
                  <span className="meta-label">Time Limit:</span>
                  <span className="meta-value">{currentQuiz.timeLimit} minutes</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Questions:</span>
                  <span className="meta-value">{currentQuiz.questions.length}</span>
                </div>
                <div className="quiz-meta-item">
                  <span className="meta-label">Total Points:</span>
                  <span className="meta-value">
                    {currentQuiz.questions.reduce((sum, q) => sum + q.points, 0)}
                  </span>
                </div>
              </div>
              
              <div className="quiz-rules">
                <h3>Instructions</h3>
                <ul>
                  <li>Read each question carefully before answering.</li>
                  <li>Once you submit the quiz, you cannot change your answers.</li>
                  <li>You must complete the quiz within the time limit.</li>
                  <li><strong>Important:</strong> Switching tabs or windows during the quiz will result in automatic termination.</li>
                </ul>
              </div>
              
              <div className="quiz-actions">
                <Button
                  variant="outline"
                  onClick={handleBackToQuizzes}
                >
                  Back to Quizzes
                </Button>
                <Button
                  variant="primary"
                  onClick={handleStartQuiz}
                >
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="quiz-container animate-fadeIn">
            <div className="quiz-header">
              <h2>{currentQuiz.title}</h2>
              
              {quizInProgress && (
                <QuizTimer
                  timeRemaining={timeRemaining}
                  timeLimit={currentQuiz.timeLimit}
                />
              )}
            </div>
            
            {quizInProgress ? (
              <QuizQuestion
                question={currentQuestion}
                questionNumber={activeQuestion + 1}
                totalQuestions={currentQuiz.questions.length}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
                onNext={nextQuestion}
                onPrev={prevQuestion}
                onSubmit={handleSubmitQuiz}
                isLastQuestion={isLastQuestion}
                isFirstQuestion={isFirstQuestion}
              />
            ) : (
              <Card className="quiz-paused">
                <CardContent>
                  <div className="pause-icon">
                    <AlertCircle size={48} />
                  </div>
                  <h3>Quiz Paused</h3>
                  <p>The quiz has been paused. Click continue to resume or exit to leave.</p>
                  <div className="paused-actions">
                    <Button
                      variant="outline"
                      onClick={handleBackToQuizzes}
                    >
                      Exit Quiz
                    </Button>
                    <Button
                      variant="primary"
                      onClick={startQuiz}
                    >
                      Continue Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;