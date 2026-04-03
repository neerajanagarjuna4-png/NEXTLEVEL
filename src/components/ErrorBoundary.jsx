import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:'2rem',textAlign:'center',fontFamily:'Inter, sans-serif'}}>
          <h2 style={{color:'#EF4444'}}>Something went wrong</h2>
          <p style={{color:'#6B7280',marginBottom:'1rem'}}>{this.state.error?.message}</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{background:'#6C63FF',color:'white',border:'none',padding:'10px 24px',borderRadius:'8px',cursor:'pointer'}}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
