import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          background: '#1a1a2e',
          color: 'white',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ fontSize: '64px', marginBottom: '20px' }}>😵</h1>
          <h2 style={{ marginBottom: '10px' }}>Hay aksi! Bir şeyler ters gitti.</h2>
          <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>
            {this.state.error?.message || 'Beklenmedik bir hata oluştu.'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--primary, #A855F7)',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
