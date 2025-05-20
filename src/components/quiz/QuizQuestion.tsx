import React from 'react';
import { Question } from '../../types';
import Button from '../ui/Button';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | undefined;
  onSelectOption: (optionIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onNext,
  onPrev,
  onSubmit,
  isLastQuestion,
  isFirstQuestion,
}) => {
  return (
    <div className="quiz-question animate-fadeIn">
      <div className="question-header">
        <div className="question-progress">
          <h3>
            Question {questionNumber} of {totalQuestions}
          </h3>
          <span className="badge badge-primary">
            {question.points} points
          </span>
        </div>
        <h2 className="question-text">{question.text}</h2>
      </div>
      
      <div className="question-options">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`quiz-option ${selectedOption === index ? 'selected' : ''}`}
            onClick={() => onSelectOption(index)}
          >
            <div className="quiz-option-indicator"></div>
            <span className="quiz-option-text">{option}</span>
          </div>
        ))}
      </div>
      
      <div className="question-navigation">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirstQuestion}
        >
          Previous
        </Button>
        
        {isLastQuestion ? (
          <Button
            variant="success"
            onClick={onSubmit}
            disabled={selectedOption === undefined}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onNext}
            disabled={selectedOption === undefined}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;