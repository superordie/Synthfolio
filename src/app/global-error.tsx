'use client';

import { useEffect } from 'react';

/**
 * A standard Next.js global error boundary.
 * It replaces the entire root layout (including <html> and <body>) when a critical error occurs.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          padding: '40px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{ color: '#3b82f6', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Oops!</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            A critical error occurred. This is usually due to a missing configuration or a temporary connection issue.
          </p>
          <div style={{
            backgroundColor: '#171717',
            border: '1px solid #262626',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'left',
            marginBottom: '2rem',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            <code style={{ fontSize: '0.875rem', color: '#ef4444', fontFamily: 'monospace' }}>
              {error.message || 'Unknown System Error'}
            </code>
          </div>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Try Refreshing
          </button>
        </div>
      </body>
    </html>
  );
}
