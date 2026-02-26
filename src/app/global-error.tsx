'use client';

/**
 * A simplified Next.js global error boundary.
 * This file must be in the root of the app directory.
 * It is designed to be extremely resilient to help debug root-level failures.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{
        backgroundColor: '#0a0a0a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'screen',
        margin: 0,
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          maxWidth: '400px',
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ color: '#3b82f6', marginBottom: '16px' }}>System Alert</h1>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
            The application encountered a startup issue. This is often related to environment configuration.
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'left',
            fontSize: '12px',
            color: '#f87171',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {error?.message || 'Unknown Initialization Error'}
          </pre>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              marginTop: '16px'
            }}
          >
            Retry Connection
          </button>
        </div>
      </body>
    </html>
  );
}
