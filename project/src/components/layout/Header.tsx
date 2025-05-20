import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { MenuIcon, X, User, ClipboardList } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
  };
  
  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };
  
  // Don't show header on quiz page to prevent distractions
  if (location.pathname === '/quiz') {
    return null;
  }
  
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <ClipboardList size={24} />
              <span>QuizMaster</span>
            </Link>
          </div>
          
          <nav className="main-nav desktop-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}>Home</Link>
              </li>
              
              {currentUser ? (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className={`nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                  </li>
                  
                  {currentUser.isAdmin && (
                    <li className="nav-item">
                      <Link to="/admin" className={`nav-link ${isActiveRoute('/admin') ? 'active' : ''}`}>Admin</Link>
                    </li>
                  )}
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/auth" className={`nav-link ${isActiveRoute('/auth') ? 'active' : ''}`}>Login</Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="header-actions">
            {currentUser ? (
              <div className="user-menu">
                <div className="user-info">
                  <User size={16} />
                  <span>{currentUser.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            )}
          </div>
          
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`} onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className={`nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`} onClick={closeMobileMenu}>
                    Dashboard
                  </Link>
                </li>
                
                {currentUser.isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin" className={`nav-link ${isActiveRoute('/admin') ? 'active' : ''}`} onClick={closeMobileMenu}>
                      Admin
                    </Link>
                  </li>
                )}
                
                <li className="nav-item">
                  <button className="nav-link logout-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/auth" className={`nav-link ${isActiveRoute('/auth') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  Login / Register
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;