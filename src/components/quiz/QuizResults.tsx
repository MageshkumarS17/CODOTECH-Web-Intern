import React from 'react';
import { QuizResult, Quiz } from '../../types';
import Card, { CardContent, CardHeader, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Award, Clock, CheckCircle, XCircle } from 'lucide-react';

interface QuizResultsProps {
  result: QuizResult;
  quiz: Quiz;
  onRetakeQuiz: () => void;
  onBackToQuizzes: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  quiz,
  onRetakeQuiz,
  onBackToQuizzes,
}) => {
  const scorePercentage = Math.round((result.score / result.maxScore) * 100);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };
  
  const renderScoreMessage = () => {
    if (scorePercentage >= 90) return 'Excellent! Outstanding performance!';
    if (scorePercentage >= 80) return 'Great job! Very good score!';
    if (scorePercentage >= 70) return 'Good work! Solid understanding!';
    if (scorePercentage >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You can do better next time.';
  };
  
  return (
    <div className="quiz-results animate-fadeIn">
      <Card>
        <CardHeader>
          <h2>Quiz Results: {quiz.title}</h2>
        </CardHeader>
        
        <CardContent>
          <div className="results-summary">
            <div className="results-score">
              <div className="score-circle">
                <span className="score-percentage">{scorePercentage}%</span>
              </div>
              <p className="score-message">{renderScoreMessage()}</p>
            </div>
            
            <div className="results-stats">
              <div className="stat-item">
                <Award size={20} />
                <span>Score: {result.score} out of {result.maxScore} points</span>
              </div>
              <div className="stat-item">
                <Clock size={20} />
                <span>Time taken: {formatTime(result.timeTaken)}</span>
              </div>
            </div>
          </div>
          
          <div className="results-details">
            <h3>Question Summary</h3>
            <div className="question-list">
              {result.answers.map((answer, index) => {
                const question = quiz.questions.find(q => q.id === answer.questionId);
                if (!question) return null;
                
                return (
                  <div key={index} className={`question-result ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="question-result-icon">
                      {answer.isCorrect ? (
                        <CheckCircle size={20} className="text-success" />
                      ) : (
                        <XCircle size={20} className="text-error" />
                      )}
                    </div>
                    <div className="question-result-content">
                      <p>{question.text}</p>
                      <div className="answer-details">
                        <span>Your answer: {answer.selectedOption >= 0 ? question.options[answer.selectedOption] : 'Not answered'}</span>
                        {!answer.isCorrect && (
                          <span>Correct answer: {question.options[question.correctOption]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="results-actions">
            <Button variant="outline" onClick={onBackToQuizzes}>
              Back to Quizzes
            </Button>
            <Button variant="primary" onClick={onRetakeQuiz}>
              Retake Quiz
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizResults;