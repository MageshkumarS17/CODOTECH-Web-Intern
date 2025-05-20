import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { FileText, Award, Users, Grid } from 'lucide-react';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content animate-fadeIn">
            <h1>Welcome to QuizMaster</h1>
            <p className="hero-description">
              Test your knowledge with interactive quizzes across various topics. 
              Challenge yourself, learn something new, and compare your scores with others!
            </p>
            <div className="hero-actions">
              {currentUser ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/quizzes')}
                >
                  Browse Quizzes
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Features</h2>
          
          <div className="features-grid row">
            <div className="feature-item col col-sm-12 col-md-6 col-lg-3 animate-fadeIn">
              <div className="feature-icon">
                <FileText size={40} />
              </div>
              <h3>Diverse Quizzes</h3>
              <p>Access a wide range of quizzes across multiple categories and difficulty levels.</p>
            </div>
            
            <div className="feature-item col col-sm-12 col-md-6 col-lg-3 animate-fadeIn delay-100">
              <div className="feature-icon">
                <Grid size={40} />
              </div>
              <h3>Timed Challenges</h3>
              <p>Test your knowledge under time pressure with our countdown timer for each quiz.</p>
            </div>
            
            <div className="feature-item col col-sm-12 col-md-6 col-lg-3 animate-fadeIn delay-200">
              <div className="feature-icon">
                <Award size={40} />
              </div>
              <h3>Leaderboards</h3>
              <p>Compare your scores with other users and compete for the top position.</p>
            </div>
            
            <div className="feature-item col col-sm-12 col-md-6 col-lg-3 animate-fadeIn delay-300">
              <div className="feature-icon">
                <Users size={40} />
              </div>
              <h3>User Profiles</h3>
              <p>Track your progress, view past quiz results, and earn achievements.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <div className="container">
          <div className="cta-content animate-fadeIn">
            <h2>Ready to Challenge Yourself?</h2>
            <p>
              Join thousands of users who are improving their knowledge while having fun!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(currentUser ? '/quizzes' : '/auth')}
            >
              {currentUser ? 'Take a Quiz Now' : 'Sign Up for Free'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;