import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

const PublicLandingPage: React.FC = () => {
  const { isSignedIn } = useUser();

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', fontFamily: 'Inter, Arial, sans-serif' }}>
      <nav style={{
        background: '#2b6cb0',
        color: 'white',
        padding: '18px 0',
        textAlign: 'center',
        fontSize: '1.2rem',
        letterSpacing: '0.5px',
        marginBottom: '0',
      }}>
        <span style={{ fontWeight: 700, fontSize: '1.5rem', marginRight: 24 }}>Camp Greenwood</span>
        <a href="/public" style={{ color: 'white', margin: '0 16px', textDecoration: 'none' }}>Home</a>
        <a href="/public/about" style={{ color: 'white', margin: '0 16px', textDecoration: 'none' }}>About</a>
        <a href="/public/contact" style={{ color: 'white', margin: '0 16px', textDecoration: 'none' }}>Contact</a>
        {isSignedIn ? (
          <>
            <UserButton />
            <a href="/" style={{ color: '#fed766', marginLeft: 32, fontWeight: 600 }}>Go to Dashboard</a>
          </>
        ) : (
          <span style={{ marginLeft: 32 }}>
            <SignInButton mode="modal">
              <button style={{ background: '#fed766', color: '#2b6cb0', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button style={{ background: '#2b6cb0', color: 'white', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}>Sign Up</button>
            </SignUpButton>
          </span>
        )}
      </nav>
      <main style={{ maxWidth: 700, margin: '48px auto', background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2b6cb0', marginBottom: 12 }}>Welcome to Camp Greenwood</h1>
        <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: 32 }}>
          Inspiring growth, friendship, and adventure in the great outdoors. Discover our programs, meet our staff, and see why generations of campers call Greenwood their summer home.
        </p>
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Camp" style={{ width: '100%', borderRadius: 10, marginBottom: 32, maxHeight: 320, objectFit: 'cover' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          <a href="/public/about" style={{ background: '#2b6cb0', color: 'white', padding: '12px 32px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>Learn More</a>
          <a href="/public/contact" style={{ background: '#fed766', color: '#2b6cb0', padding: '12px 32px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: '1.1rem' }}>Contact Us</a>
        </div>
        <div style={{ color: '#718096', fontSize: '1rem', marginTop: 24 }}>
          <strong>Already staff?</strong> <a href="/" style={{ color: '#2b6cb0', textDecoration: 'underline' }}>Sign in to the dashboard</a>
        </div>
      </main>
      <footer style={{ textAlign: 'center', color: '#718096', fontSize: '0.95rem', padding: '24px 0 12px 0' }}>
        &copy; {new Date().getFullYear()} Camp Greenwood
      </footer>
    </div>
  );
};

export default PublicLandingPage; 