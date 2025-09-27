// src/components/TonConnectErrorBoundary.tsx
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  AlertTitle,
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  Warning as WarningIcon
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TonConnectErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 TonConnectErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 2,
            background: 'linear-gradient(135deg, #0a0e1a 0%, #151a2e 100%)',
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: '100%',
              p: 4,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WarningIcon color="warning" sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h5" color="warning.main">
                  TonConnect Error
                </Typography>
              </Box>
              
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>Wallet Connection Error</AlertTitle>
                There was an error initializing the wallet connection. This might be due to network issues or missing configuration.
              </Alert>
              
              {this.state.error && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Error details:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      p: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 1,
                      overflow: 'auto',
                      maxHeight: '100px'
                    }}
                  >
                    {this.state.error.message}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleReset}
                  startIcon={<RefreshIcon />}
                  fullWidth
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleReload}
                  fullWidth
                >
                  Reload Page
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <AlertTitle>Troubleshooting Tips</AlertTitle>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>Check your internet connection</li>
                  <li>Make sure you have a TON wallet installed</li>
                  <li>Try refreshing the page</li>
                  <li>Clear browser cache and try again</li>
                </ul>
              </Alert>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}