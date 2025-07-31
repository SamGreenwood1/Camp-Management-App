// pages/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle authentication
    // For this example, we'll just redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: '#2b6cb0' }}>
          Login to Your Account
        </h1>
        <p style={{ marginBottom: '32px', color: '#718096' }}>
          Welcome back! Please enter your details.
        </p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#4a5568' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#4a5568' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                fontSize: '1rem',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              background: '#2b6cb0',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
