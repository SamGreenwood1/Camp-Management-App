import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <a href="/public/contact" style={{ color: 'white', margin: '0 16px', textDecoration: 'none', fontWeight: 600 }}>Contact</a>
      </nav>
      <main style={{ maxWidth: 700, margin: '48px auto', background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#2b6cb0', marginBottom: 12 }}>Contact Camp Greenwood</h1>
        <p style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: 24 }}>
          Have questions? Want to learn more? Reach out to us below or send us a message!
        </p>
        <div style={{ marginBottom: 32, color: '#4a5568', fontSize: '1.05rem' }}>
          <div><strong>Email:</strong> info@campgreenwood.com</div>
          <div><strong>Phone:</strong> (555) 123-4567</div>
          <div><strong>Address:</strong> 123 Camp Lane, Greenwood, State, ZIP</div>
        </div>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e0', marginTop: 4, marginBottom: 16 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e0', marginTop: 4, marginBottom: 16 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Message:
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #cbd5e0', marginTop: 4, marginBottom: 16 }}
            />
          </label>
          <button type="submit" style={{ background: '#2b6cb0', color: 'white', padding: '10px 28px', borderRadius: 6, fontWeight: 600, border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>
            Send Message
          </button>
        </form>
        {submitted && <div style={{ color: '#38a169', marginTop: 24, fontWeight: 600 }}>Thank you! Your message has been received.</div>}
      </main>
      <footer style={{ textAlign: 'center', color: '#718096', fontSize: '0.95rem', padding: '24px 0 12px 0' }}>
        &copy; {new Date().getFullYear()} Camp Greenwood
      </footer>
    </div>
  );
};

export default ContactPage; 