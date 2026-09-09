import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Royal Agra Estate App:', error, errorInfo);
    
    // Auto-reload on chunk load failures (e.g. after a new deployment)
    const isChunkError = error.message?.includes('Loading chunk') || 
                         error.message?.includes('dynamically imported module') ||
                         error.message?.includes('Failed to fetch dynamically imported module');
    
    if (isChunkError) {
      const reloadKey = 'rae_chunk_reload_ts';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
      }
    }
  }

  private handleResetCacheAndReload = () => {
    try {
      localStorage.removeItem('royal_agra_properties_cache_v2');
      localStorage.removeItem('royal_agra_deleted_property_ids_v2');
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.href = '/?screen=home';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8F5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
          color: '#1A2E26'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(15, 56, 44, 0.08)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#0F382C',
              color: '#C5A869',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px'
            }}>
              🏛️
            </div>
            
            <h1 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#0F382C',
              marginBottom: '10px',
              letterSpacing: '-0.02em'
            }}>
              Royal Agra Estate
            </h1>
            
            <p style={{
              fontSize: '14px',
              color: '#4B5563',
              lineHeight: '1.6',
              marginBottom: '28px'
            }}>
              We encountered a temporary loading issue. Please refresh or reset the cache to load the latest luxury listings in Agra.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  padding: '13px',
                  backgroundColor: '#0F382C',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Refresh Page
              </button>
              
              <button
                type="button"
                onClick={this.handleResetCacheAndReload}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: '1px solid #D1D5DB',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Reload Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
