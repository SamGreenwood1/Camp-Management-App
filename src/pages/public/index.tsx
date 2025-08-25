import React from 'react';

const PublicLandingPage: React.FC = () => {
  return (
    <div className="landing-page" style={{ 
      fontFamily: 'Segoe UI, Arial, sans-serif', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        padding: '80px 20px 60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '700', 
          marginBottom: '24px',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          Camp Management App
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '40px',
          opacity: '0.9',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Streamline your summer camp operations with intelligent scheduling, 
          program management, and staff coordination.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button style={{ 
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '16px 32px', 
            fontSize: '18px', 
            fontWeight: '600', 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
            transition: 'all 0.3s ease'
          }}>
            Get Started
          </button>
          <button style={{ 
            background: 'transparent', 
        color: 'white',
            border: '2px solid white', 
            borderRadius: '8px', 
            padding: '16px 32px', 
            fontSize: '18px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Learn More
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '80px 20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '60px',
            fontWeight: '600'
          }}>
            Powerful Features for Modern Camps
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '40px' 
          }}>
            {/* Feature 1 */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                background: '#4CAF50', 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px',
                fontSize: '24px'
              }}>
                🧠
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '600' }}>
                Intelligent Scheduling
              </h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Advanced algorithms automatically assign cabins to activities while respecting 
                capacity limits, travel time, and camper preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                background: '#2196F3', 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px',
                fontSize: '24px'
              }}>
                📚
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '600' }}>
                Program Bank
              </h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Centralized repository for all camp programs with AI-powered document 
                processing and approval workflows.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                background: '#FF9800', 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px',
                fontSize: '24px'
              }}>
                👥
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '600' }}>
                Staff Management
              </h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Role-based access control, staff scheduling, and seamless coordination 
                between counselors, unit heads, and program directors.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                background: '#9C27B0', 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px',
                fontSize: '24px'
              }}>
                🔄
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '600' }}>
                Dynamic Adaptation
              </h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Automatically adjust schedules when cabins merge, campers arrive/depart, 
                or weather conditions change.
              </p>
            </div>

            {/* Feature 5 */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                background: '#F44336', 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px',
                fontSize: '24px'
              }}>
                📱
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '600' }}>
                Progressive Web App
              </h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Works offline, installs on any device, and provides a native app experience 
                for staff in remote camp locations.
              </p>
            </div>

            {/* Feature 6 */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '32px', 
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ 
                background: '#00BCD4', 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px',
                fontSize: '24px'
              }}>
                🔗
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: '600' }}>
                Seamless Integration
              </h3>
              <p style={{ opacity: '0.9', lineHeight: '1.6' }}>
                Connect with existing camp management systems like CampMinder, CampDoc, 
                and Campwise for unified data management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        textAlign: 'center',
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '24px',
          fontWeight: '600'
        }}>
          Ready to Transform Your Camp?
        </h2>
        <p style={{ 
        fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: '0.9',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Join modern camps that are already using our platform to create better 
          experiences for campers and staff.
        </p>
        <button style={{ 
          background: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          padding: '20px 40px', 
          fontSize: '20px', 
          fontWeight: '600', 
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
          transition: 'all 0.3s ease'
        }}>
          Start Free Trial
        </button>
        </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        marginTop: '60px'
      }}>
        <p style={{ opacity: '0.7', marginBottom: '16px' }}>
          © 2025 Camp Management App. All rights reserved.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: 'white', opacity: '0.7', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'white', opacity: '0.7', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'white', opacity: '0.7', textDecoration: 'none' }}>Support</a>
          <a href="#" style={{ color: 'white', opacity: '0.7', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage; 
