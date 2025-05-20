import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Question, Quiz } from '../../types';
import { Trash2, PlusCircle, ClipboardList, Save } from 'lucide-react';

interface QuizCreatorProps {
  onSaveQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  editingQuiz?: Quiz;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onSaveQuiz, editingQuiz }) => {
  const [title, setTitle] = useState(editingQuiz?.title || '');
  const [description, setDescription] = useState(editingQuiz?.description || '');
  const [timeLimit, setTimeLimit] = useState(editingQuiz?.timeLimit.toString() || '10');
  const [questions, setQuestions] = useState<Question[]>(
    editingQuiz?.questions || [{
      id: Date.now().toString(),
      text: '',
      options: ['', '', '', ''],
      correctOption: 0,
      points: 10,
    }]
  );
  
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: '',
        options: ['', '', '', ''],
        correctOption: 0,
        points: 10,
      }
    ]);
  };
  
  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };
  
  const handleSaveQuiz = () => {
    const quiz: Omit<Quiz, 'id'> = {
      title,
      description,
      timeLimit: parseInt(timeLimit) || 10,
      questions,
      createdBy: '1', // In a real app, this would be the current user's ID
      isPublished: true,
    };
    
    onSaveQuiz(quiz);
  };
  
  const isFormValid = () => {
    if (!title || !description || !timeLimit) return false;
    
    for (const question of questions) {
      if (!question.text) return false;
      
      for (const option of question.options) {
        if (!option) return false;
      }
    }
    
    return true;
  };
  
  return (
    <div className="quiz-creator animate-fadeIn">
      <Card>
        <CardHeader>
          <h2>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>
        </CardHeader>
        
        <CardContent>
          <div className="quiz-form">
            <Input
              label="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
            
            <div className="form-group">
              <label className="form-label">Quiz Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                className="form-input"
                rows={3}
              />
            </div>
            
            <Input
              type="number"
              label="Time Limit (minutes)"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="Enter time limit in minutes"
              required
            />
            
            <div className="questions-section">
              <div className="section-header">
                <h3><ClipboardList size={20} /> Questions</h3>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleAddQuestion}
                >
                  <PlusCircle size={16} /> Add Question
                </Button>
              </div>
              
              {questions.map((question, questionIndex) => (
                <div key={question.id} className="question-editor card">
                  <div className="question-header">
                    <h4>Question {questionIndex + 1}</h4>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleRemoveQuestion(questionIndex)}
                      disabled={questions.length <= 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="question-content">
                    <Input
                      label="Question Text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                      placeholder="Enter question text"
                      required
                    />
                    
                    <div className="question-options">
                      <label className="form-label">Options</label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-input">
                          <input
                            type="radio"
                            id={`q${questionIndex}-opt${optionIndex}`}
                            name={`q${questionIndex}-correct`}
                            checked={question.correctOption === optionIndex}
                            onChange={() => handleQuestionChange(questionIndex, 'correctOption', optionIndex)}
                            className="option-radio"
                          />
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                      <p className="option-help">Select the radio button next to the correct option.</p>
                    </div>
                    
                    <Input
                      type="number"
                      label="Points"
                      value={question.points.toString()}
                      onChange={(e) => handleQuestionChange(questionIndex, 'points', parseInt(e.target.value) || 0)}
                      placeholder="Points for this question"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            variant="success"
            onClick={handleSaveQuiz}
            disabled={!isFormValid()}
          >
            <Save size={16} /> {editingQuiz ? 'Update Quiz' : 'Save Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizCreator;