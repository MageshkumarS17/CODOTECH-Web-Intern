import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  timeRemaining: number; // in seconds
  timeLimit: number; // in minutes
}

const QuizTimer: React.FC<QuizTimerProps> = ({ timeRemaining, timeLimit }) => {
  const totalSeconds = timeLimit * 60;
  const percentRemaining = (timeRemaining / totalSeconds) * 100;
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const timerStatus = useMemo(() => {
    if (percentRemaining > 50) return 'timer-normal';
    if (percentRemaining > 25) return 'timer-warning';
    return 'timer-danger';
  }, [percentRemaining]);
  
  const timerTextClass = useMemo(() => {
    if (percentRemaining > 50) return 'text-success';
    if (percentRemaining > 25) return 'text-warning';
    return 'text-danger';
  }, [percentRemaining]);
  
  return (
    <div className="quiz-timer">
      <div className="timer-header">
        <div className="timer-icon">
          <Clock className={timerTextClass} size={20} />
          <span>Time Remaining</span>
        </div>
        <span className={`timer-text ${timerTextClass}`}>{formatTime(timeRemaining)}</span>
      </div>
      
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${timerStatus}`}
          style={{ width: `${percentRemaining}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizTimer;