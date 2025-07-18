import React from 'react';

const AboutPage: React.FC = () => (
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
      <a href="/public/about" style={{ color: 'white', margin: '0 16px', textDecoration: 'none', fontWeight: 600 }}>About</a>
      <a href="/public/contact" style={{ color: 'white', margin: '0 16px', textDecoration: 'none' }}>Contact</a>
    </nav>
    <main style={{ maxWidth: 700, margin: '48px auto', background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#2b6cb0', marginBottom: 12 }}>About Camp Greenwood</h1>
      <p style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: 24 }}>
        Camp Greenwood has been inspiring campers for over 50 years. Nestled in the heart of nature, our camp is dedicated to fostering growth, friendship, and adventure for children and teens.
      </p>
      <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" alt="Campfire" style={{ width: '100%', borderRadius: 10, marginBottom: 32, maxHeight: 320, objectFit: 'cover' }} />
      <section style={{ textAlign: 'left', margin: '0 auto', maxWidth: 600 }}>
        <h2 style={{ color: '#2b6cb0', fontSize: '1.3rem', marginTop: 0 }}>Our Mission</h2>
        <p style={{ color: '#4a5568' }}>
          To create a safe, inclusive, and fun environment where campers can discover new skills, build lasting friendships, and develop a lifelong love for the outdoors.
        </p>
        <h2 style={{ color: '#2b6cb0', fontSize: '1.3rem' }}>Camp Highlights</h2>
        <ul style={{ color: '#4a5568', fontSize: '1.05rem', lineHeight: 1.7, paddingLeft: 24 }}>
          <li>Wide range of activities: arts, sports, nature, adventure, and more</li>
          <li>Experienced, caring staff and counselors</li>
          <li>Beautiful lakeside setting and modern facilities</li>
          <li>Focus on personal growth, teamwork, and leadership</li>
        </ul>
      </section>
    </main>
    <footer style={{ textAlign: 'center', color: '#718096', fontSize: '0.95rem', padding: '24px 0 12px 0' }}>
      &copy; {new Date().getFullYear()} Camp Greenwood
    </footer>
  </div>
);

export default AboutPage; 