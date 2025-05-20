import React from 'react';
import { Quiz } from '../../types';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Clock, FileText } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quiz: Quiz) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  return (
    <Card hover className="quiz-card animate-fadeIn">
      <CardContent>
        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-description">{quiz.description}</p>
        
        <div className="quiz-meta">
          <div className="quiz-meta-item">
            <Clock size={18} />
            <span>{quiz.timeLimit} minutes</span>
          </div>
          
          <div className="quiz-meta-item">
            <FileText size={18} />
            <span>{quiz.questions.length} questions</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          variant="primary"
          fullWidth
          onClick={() => onStartQuiz(quiz)}
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;