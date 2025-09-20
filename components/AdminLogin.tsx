
import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // In a real application, this would be a secure API call.
    // For this demo, we use hardcoded credentials.
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        onLoginSuccess();
      } else {
        setError('Invalid username or password.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-6">Admin Access</h2>
          <Input
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Spinner /> : 'Login'}
          </Button>
          <div className="text-center">
            <a href="#/" className="text-indigo-600 hover:text-indigo-500 transition-colors text-sm font-medium">
              &larr; Back to Registration Form
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;