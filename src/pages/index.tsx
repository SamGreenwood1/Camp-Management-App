// pages/index.tsx
import React from 'react';
import { useRouter } from 'next/router';

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#2b6cb0',
      color: 'white',
      fontFamily: 'Inter, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 16px',
    }}>
      <header>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '16px' }}>
          Welcome to the Camp Programming Management App
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '32px', maxWidth: '600px' }}>
          The all-in-one solution for managing your camp's scheduling, programs, and staff.
        </p>
      </header>
      <main>
        <button
          onClick={handleLoginRedirect}
          style={{
            background: 'white',
            color: '#2b6cb0',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 32px',
            fontSize: '1.2rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
          }}
        >
          Get Started
        </button>
      </main>
      <footer style={{
        position: 'absolute',
        bottom: '16px',
        fontSize: '0.9rem',
      }}>
        &copy; {new Date().getFullYear()} Camp Programming Management App
      </footer>
    </div>
  );
};

export default LandingPage;