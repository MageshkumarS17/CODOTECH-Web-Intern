export type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  points: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
  createdBy: string;
  isPublished: boolean;
};

export type QuizResult = {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  maxScore: number;
  timeTaken: number; // in seconds
  completedAt: string; // ISO date string
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
};

export type UserState = {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
};

export type AppState = {
  currentQuiz: Quiz | null;
  quizResults: QuizResult[];
  allQuizzes: Quiz[];
  activeQuestion: number;
  timeRemaining: number;
  answers: Record<string, number>;
  quizInProgress: boolean;
  quizCompleted: boolean;
};