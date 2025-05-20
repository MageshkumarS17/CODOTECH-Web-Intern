import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Quiz, QuizResult } from '../types';
import { mockQuizzes, mockQuizResults } from '../data/mockData';
import { useAuth } from './AuthContext';

type Action =
  | { type: 'LOAD_QUIZZES'; payload: Quiz[] }
  | { type: 'LOAD_RESULTS'; payload: QuizResult[] }
  | { type: 'SET_CURRENT_QUIZ'; payload: Quiz }
  | { type: 'START_QUIZ' }
  | { type: 'END_QUIZ' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SELECT_ANSWER'; payload: { questionId: string; optionIndex: number } }
  | { type: 'TICK_TIMER' }
  | { type: 'SUBMIT_QUIZ'; payload: QuizResult }
  | { type: 'RESET_QUIZ_STATE' };

const initialState: AppState = {
  currentQuiz: null,
  quizResults: [],
  allQuizzes: [],
  activeQuestion: 0,
  timeRemaining: 0,
  answers: {},
  quizInProgress: false,
  quizCompleted: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_QUIZZES':
      return { ...state, allQuizzes: action.payload };
    case 'LOAD_RESULTS':
      return { ...state, quizResults: action.payload };
    case 'SET_CURRENT_QUIZ':
      return {
        ...state,
        currentQuiz: action.payload,
        timeRemaining: action.payload.timeLimit * 60, // Convert minutes to seconds
        activeQuestion: 0,
        answers: {},
        quizInProgress: false,
        quizCompleted: false,
      };
    case 'START_QUIZ':
      return {
        ...state,
        quizInProgress: true,
        quizCompleted: false,
      };
    case 'END_QUIZ':
      return {
        ...state,
        quizInProgress: false,
        quizCompleted: true,
      };
    case 'NEXT_QUESTION':
      if (state.currentQuiz && state.activeQuestion < state.currentQuiz.questions.length - 1) {
        return { ...state, activeQuestion: state.activeQuestion + 1 };
      }
      return state;
    case 'PREV_QUESTION':
      if (state.activeQuestion > 0) {
        return { ...state, activeQuestion: state.activeQuestion - 1 };
      }
      return state;
    case 'SELECT_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.optionIndex,
        },
      };
    case 'TICK_TIMER':
      if (state.timeRemaining > 0 && state.quizInProgress) {
        return { ...state, timeRemaining: state.timeRemaining - 1 };
      }
      if (state.timeRemaining <= 0 && state.quizInProgress) {
        return { ...state, quizInProgress: false, quizCompleted: true };
      }
      return state;
    case 'SUBMIT_QUIZ':
      return {
        ...state,
        quizResults: [...state.quizResults, action.payload],
        quizInProgress: false,
        quizCompleted: true,
      };
    case 'RESET_QUIZ_STATE':
      return {
        ...state,
        currentQuiz: null,
        activeQuestion: 0,
        timeRemaining: 0,
        answers: {},
        quizInProgress: false,
        quizCompleted: false,
      };
    default:
      return state;
  }
}

interface QuizContextType extends AppState {
  loadQuizzes: () => void;
  loadResults: () => void;
  setCurrentQuiz: (quiz: Quiz) => void;
  startQuiz: () => void;
  endQuiz: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  selectAnswer: (questionId: string, optionIndex: number) => void;
  submitQuiz: () => void;
  resetQuizState: () => void;
  calculateScore: () => { score: number; maxScore: number };
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadQuizzes();
    if (currentUser) {
      loadResults();
    }
  }, [currentUser]);

  // Set up timer
  useEffect(() => {
    let timerId: number;
    
    if (state.quizInProgress) {
      timerId = window.setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    
    return () => {
      clearInterval(timerId);
    };
  }, [state.quizInProgress]);

  // Tab visibility change detection for anti-cheating
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (state.quizInProgress && document.visibilityState === 'hidden') {
        // End quiz if user switches tabs or windows
        endQuiz();
        alert('Quiz has been terminated due to potential cheating. Switching tabs or windows is not allowed during the quiz.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.quizInProgress]);

  const loadQuizzes = () => {
    // In a real app, fetch quizzes from API
    dispatch({ type: 'LOAD_QUIZZES', payload: mockQuizzes });
  };

  const loadResults = () => {
    if (!currentUser) return;
    
    // In a real app, fetch results from API filtered by user
    const userResults = mockQuizResults.filter(result => result.userId === currentUser.id);
    dispatch({ type: 'LOAD_RESULTS', payload: userResults });
  };

  const setCurrentQuiz = (quiz: Quiz) => {
    dispatch({ type: 'SET_CURRENT_QUIZ', payload: quiz });
  };

  const startQuiz = () => {
    dispatch({ type: 'START_QUIZ' });
  };

  const endQuiz = () => {
    dispatch({ type: 'END_QUIZ' });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const prevQuestion = () => {
    dispatch({ type: 'PREV_QUESTION' });
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    dispatch({ type: 'SELECT_ANSWER', payload: { questionId, optionIndex } });
  };

  const calculateScore = () => {
    if (!state.currentQuiz) return { score: 0, maxScore: 0 };
    
    let score = 0;
    let maxScore = 0;
    
    state.currentQuiz.questions.forEach(question => {
      maxScore += question.points;
      const selectedAnswer = state.answers[question.id];
      
      if (selectedAnswer === question.correctOption) {
        score += question.points;
      }
    });
    
    return { score, maxScore };
  };

  const submitQuiz = () => {
    if (!state.currentQuiz || !currentUser) return;
    
    const { score, maxScore } = calculateScore();
    const timeTaken = state.currentQuiz.timeLimit * 60 - state.timeRemaining;
    
    const quizResult: QuizResult = {
      id: Date.now().toString(),
      userId: currentUser.id,
      quizId: state.currentQuiz.id,
      score,
      maxScore,
      timeTaken,
      completedAt: new Date().toISOString(),
      answers: state.currentQuiz.questions.map(question => ({
        questionId: question.id,
        selectedOption: state.answers[question.id] ?? -1,
        isCorrect: state.answers[question.id] === question.correctOption,
      })),
    };
    
    dispatch({ type: 'SUBMIT_QUIZ', payload: quizResult });
  };

  const resetQuizState = () => {
    dispatch({ type: 'RESET_QUIZ_STATE' });
  };

  return (
    <QuizContext.Provider
      value={{
        ...state,
        loadQuizzes,
        loadResults,
        setCurrentQuiz,
        startQuiz,
        endQuiz,
        nextQuestion,
        prevQuestion,
        selectAnswer,
        submitQuiz,
        resetQuizState,
        calculateScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};