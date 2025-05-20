import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card, { CardContent, CardFooter, CardHeader } from '../ui/Card';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    await register(username, email, password);
  };

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <h2 className="text-center">Create an Account</h2>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          {(error || formError) && (
            <div className="alert alert-error">
              {formError || error}
            </div>
          )}
          
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
          
          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
          
          <Input
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="text-center">
        <p>
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="btn-link"
            type="button"
          >
            Login
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;