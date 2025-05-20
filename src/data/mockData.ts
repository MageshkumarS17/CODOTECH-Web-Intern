import { Quiz, User, QuizResult } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    isAdmin: false,
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    isAdmin: true,
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Web Development Basics',
    description: 'Test your knowledge of HTML, CSS, and JavaScript fundamentals.',
    timeLimit: 10,
    isPublished: true,
    createdBy: '2',
    questions: [
      {
        id: 'q1',
        text: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Multi Language',
          'Hyper Transfer Markup Language',
          'Home Tool Markup Language',
        ],
        correctOption: 0,
        points: 10,
      },
      {
        id: 'q2',
        text: 'Which CSS property is used to change the text color?',
        options: ['color', 'text-color', 'font-color', 'text-style'],
        correctOption: 0,
        points: 10,
      },
      {
        id: 'q3',
        text: 'Which of the following is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Float', 'Undefined'],
        correctOption: 2,
        points: 10,
      },
      {
        id: 'q4',
        text: 'What symbol is used for single-line comments in JavaScript?',
        options: ['#', '//', '/*', '<!--'],
        correctOption: 1,
        points: 10,
      },
      {
        id: 'q5',
        text: 'Which CSS property is used to add space between elements?',
        options: ['spacing', 'margin', 'padding', 'gap'],
        correctOption: 1,
        points: 10,
      },
    ],
  },
  {
    id: '2',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React concepts and hooks.',
    timeLimit: 15,
    isPublished: true,
    createdBy: '2',
    questions: [
      {
        id: 'q1',
        text: 'What is JSX in React?',
        options: [
          'JavaScript XML - A syntax extension for JavaScript',
          'JavaScript Extra - An additional JavaScript library',
          'JavaScript Experience - A user interface pattern',
          'JavaScript Execute - A runtime environment',
        ],
        correctOption: 0,
        points: 10,
      },
      {
        id: 'q2',
        text: 'Which hook is used to manage state in a functional component?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctOption: 1,
        points: 10,
      },
      {
        id: 'q3',
        text: 'What is the virtual DOM in React?',
        options: [
          'A complete copy of the real DOM',
          'A lightweight copy of the real DOM in memory',
          'A new browser technology developed for React',
          'A rendering engine specific to mobile devices',
        ],
        correctOption: 1,
        points: 10,
      },
      {
        id: 'q4',
        text: 'Which method is NOT part of the React component lifecycle?',
        options: ['componentDidMount', 'componentWillReceiveProps', 'componentDidRender', 'componentWillUnmount'],
        correctOption: 2,
        points: 10,
      },
      {
        id: 'q5',
        text: 'What is the purpose of React fragments?',
        options: [
          'To optimize rendering performance',
          'To group multiple elements without adding extra nodes to the DOM',
          'To create reusable component templates',
          'To isolate component styling',
        ],
        correctOption: 1,
        points: 10,
      },
    ],
  },
];

export const mockQuizResults: QuizResult[] = [
  {
    id: '1',
    userId: '1',
    quizId: '1',
    score: 30,
    maxScore: 50,
    timeTaken: 350,
    completedAt: '2023-04-15T14:30:00Z',
    answers: [
      { questionId: 'q1', selectedOption: 0, isCorrect: true },
      { questionId: 'q2', selectedOption: 0, isCorrect: true },
      { questionId: 'q3', selectedOption: 3, isCorrect: false },
      { questionId: 'q4', selectedOption: 1, isCorrect: true },
      { questionId: 'q5', selectedOption: 3, isCorrect: false },
    ],
  },
];