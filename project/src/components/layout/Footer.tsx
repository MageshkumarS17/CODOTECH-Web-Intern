import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/" className="logo-link">
              <ClipboardList size={24} />
              <span>QuizMaster</span>
            </Link>
            <p className="tagline">
              Test your knowledge, challenge your friends
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h3>Site Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/auth">Login</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Resources</h3>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Connect</h3>
              <div className="social-links">
                <a href="#" className="social-link">
                  <Github size={20} />
                </a>
                <a href="#" className="social-link">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} QuizMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;