// src/components/ErrorBoundary.tsx
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
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  BugReport as BugReportIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  theme?: any; // Добавляем опциональный prop для темы
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  errorStack: string;
  componentStack: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    errorStack: '',
    componentStack: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: process.env.NODE_ENV === 'development',
      errorStack: error.stack || '',
      componentStack: '',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
      showDetails: process.env.NODE_ENV === 'development',
      errorStack: error.stack || '',
      componentStack: errorInfo.componentStack || '',
    });
  }

  private handleReset = () => {
    console.log('🔄 Resetting error boundary');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorStack: '',
      componentStack: '',
    });
  };

  private handleReload = () => {
    console.log('🔄 Reloading page');
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  private copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('📋 Copied to clipboard');
  };

  render() {
    // Используем тему из props или значения по умолчанию
    const theme = this.props.theme || {
      palette: {
        background: { default: '#121212', grey: { 900: '#121212', 800: '#1e1e1e' } },
        primary: { main: '#90caf9' },
        divider: 'rgba(255, 255, 255, 0.12)',
        text: { primary: '#fff', secondary: 'rgba(255, 255, 255, 0.7)' },
      }
    };
    
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
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`,
          }}
        >
          <Card
            sx={{
              maxWidth: 800,
              width: '100%',
              p: 4,
              borderRadius: 3,
              background: `linear-gradient(145deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 0 30px ${theme.palette.primary.main}60`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BugReportIcon color="error" sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h4" component="h1" color="error">
                  Произошла ошибка
                </Typography>
              </Box>
              
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Критическая ошибка приложения</AlertTitle>
                Приложение столкнулось с непредвиденной ошибкой. Пожалуйста, попробуйте перезагрузить страницу или связаться с поддержкой.
              </Alert>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
                  Сообщение об ошибке:
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'monospace',
                    p: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: '100px'
                  }}
                >
                  {this.state.error?.message || 'Неизвестная ошибка'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1 }}>
                    Технические детали
                  </Typography>
                  <IconButton onClick={this.toggleDetails} size="small">
                    {this.state.showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                
                <Collapse in={this.state.showDetails}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Компонент:</strong> {this.state.componentStack.split('\n')[0] || 'Неизвестный компонент'}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Стек вызовов компонента:</strong>
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => this.copyToClipboard(this.state.componentStack)}
                        >
                          Копировать
                        </Button>
                      </Box>
                      <pre style={{ 
                        marginTop: '0.5rem',
                        padding: '1rem',
                        background: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        overflow: 'auto',
                        fontSize: '0.8rem',
                        lineHeight: '1.4',
                        maxHeight: '200px'
                      }}>
                        {this.state.componentStack}
                      </pre>
                    </Box>
                    
                    {this.state.errorStack && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Полный стек ошибки:</strong>
                          </Typography>
                          <Button 
                            size="small" 
                            onClick={() => this.copyToClipboard(this.state.errorStack)}
                          >
                            Копировать
                          </Button>
                        </Box>
                        <pre style={{ 
                          marginTop: '0.5rem',
                          padding: '1rem',
                          background: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                          overflow: 'auto',
                          fontSize: '0.8rem',
                          lineHeight: '1.4',
                          maxHeight: '200px'
                        }}>
                          {this.state.errorStack}
                        </pre>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleReset}
                  startIcon={<RefreshIcon />}
                  fullWidth
                >
                  Попробовать снова
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleReload}
                  fullWidth
                >
                  Перезагрузить страницу
                </Button>
              </Box>
              
              {process.env.NODE_ENV === 'development' && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <AlertTitle>Режим разработки</AlertTitle>
                  Вы находитесь в режиме разработки. Эта ошибка может быть связана с проблемой в коде. 
                  Проверьте консоль браузера для получения дополнительной информации.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}