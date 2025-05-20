import React, { useState, useEffect } from 'react';
import { QuizResult, User, Quiz } from '../../types';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { Trophy, Award, Medal } from 'lucide-react';

interface LeaderboardEntry {
  user: User;
  score: number;
  timeTaken: number;
  completedAt: string;
}

interface LeaderboardProps {
  quizResults: QuizResult[];
  users: User[];
  quizzes: Quiz[];
  selectedQuizId?: string;
  onSelectQuiz?: (quizId: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  quizResults,
  users,
  quizzes,
  selectedQuizId,
  onSelectQuiz,
}) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    let filteredResults = quizResults;
    
    if (selectedQuizId) {
      filteredResults = quizResults.filter(result => result.quizId === selectedQuizId);
    }
    
    // Group by user and get best attempt
    const userBestAttempts = new Map<string, QuizResult>();
    
    filteredResults.forEach(result => {
      const existingAttempt = userBestAttempts.get(result.userId);
      const scorePercentage = (result.score / result.maxScore) * 100;
      
      if (!existingAttempt) {
        userBestAttempts.set(result.userId, result);
        return;
      }
      
      const existingScorePercentage = (existingAttempt.score / existingAttempt.maxScore) * 100;
      
      // If new score is better, or if scores are equal but time is better
      if (
        scorePercentage > existingScorePercentage || 
        (scorePercentage === existingScorePercentage && result.timeTaken < existingAttempt.timeTaken)
      ) {
        userBestAttempts.set(result.userId, result);
      }
    });
    
    // Convert to array and sort
    const leaderboardEntries: LeaderboardEntry[] = Array.from(userBestAttempts.values())
      .map(result => {
        const user = users.find(u => u.id === result.userId);
        if (!user) return null;
        
        return {
          user,
          score: (result.score / result.maxScore) * 100, // percentage
          timeTaken: result.timeTaken,
          completedAt: result.completedAt,
        };
      })
      .filter((entry): entry is LeaderboardEntry => entry !== null)
      .sort((a, b) => {
        // Sort by score (desc), then by time taken (asc)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeTaken - b.timeTaken;
      });
    
    setLeaderboardData(leaderboardEntries);
  }, [quizResults, users, selectedQuizId]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  const getLeaderboardIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="medal gold" size={24} />;
      case 1:
        return <Award className="medal silver" size={24} />;
      case 2:
        return <Medal className="medal bronze" size={24} />;
      default:
        return <span className="position">{position + 1}</span>;
    }
  };
  
  return (
    <div className="leaderboard animate-fadeIn">
      <Card>
        <CardHeader>
          <h2>Leaderboard</h2>
          {quizzes.length > 0 && (
            <div className="quiz-filter">
              <select
                value={selectedQuizId || ''}
                onChange={(e) => onSelectQuiz && onSelectQuiz(e.target.value)}
                className="form-input"
              >
                <option value="">All Quizzes</option>
                {quizzes.map(quiz => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {leaderboardData.length > 0 ? (
            <div className="leaderboard-table">
              <div className="leaderboard-header">
                <div className="leaderboard-position">Rank</div>
                <div className="leaderboard-user">Player</div>
                <div className="leaderboard-score">Score</div>
                <div className="leaderboard-time">Time</div>
              </div>
              
              {leaderboardData.map((entry, index) => (
                <div 
                  key={entry.user.id} 
                  className={`leaderboard-row ${index < 3 ? `top-${index + 1}` : ''}`}
                >
                  <div className="leaderboard-position">
                    {getLeaderboardIcon(index)}
                  </div>
                  <div className="leaderboard-user">
                    {entry.user.username}
                  </div>
                  <div className="leaderboard-score">
                    {entry.score.toFixed(1)}%
                  </div>
                  <div className="leaderboard-time">
                    {formatTime(entry.timeTaken)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No quiz results available for leaderboard.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;