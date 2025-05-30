import { createTheme } from '@mui/material/styles';

export const bunkerTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b35', // Emergency orange
      dark: '#cc4400',
      light: '#ff8a65',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00bcd4', // Cyan for tech/bunker feel
      dark: '#00838f',
      light: '#4dd0e1',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      dark: '#d32f2f',
      light: '#ef5350',
    },
    warning: {
      main: '#ff9800',
      dark: '#f57c00',
      light: '#ffb74d',
    },
    success: {
      main: '#4caf50',
      dark: '#2e7d32',
      light: '#66bb6a',
    },
    background: {
      default: '#0a0a0a', // Deeper black
      paper: '#1a1a1a', // Card background
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#666666',
    },
    divider: 'rgba(255, 107, 53, 0.12)',
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto Mono", monospace',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      textShadow: '0 0 10px rgba(255, 107, 53, 0.5)',
      letterSpacing: '0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      textShadow: '0 0 8px rgba(255, 107, 53, 0.3)',
      letterSpacing: '0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.01em',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    body1: {
      fontFamily: '"Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
    },
    button: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          background: 'linear-gradient(45deg, #ff6b35 30%, #ff8a65 90%)',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          boxShadow: '0 0 20px rgba(255, 107, 53, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)',
            background: 'linear-gradient(45deg, #cc4400 30%, #ff6b35 90%)',
          },
          '&:disabled': {
            background: '#333',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderRadius: 12,
          border: '1px solid rgba(255, 107, 53, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 12,
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.3), transparent, rgba(0, 188, 212, 0.3))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 8,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'rgba(255, 107, 53, 0.05)',
            borderColor: 'rgba(255, 107, 53, 0.2)',
          },
        },
      },
    },
  },
});

export default bunkerTheme;