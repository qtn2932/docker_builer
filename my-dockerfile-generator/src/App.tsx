import { Container, Typography, Paper, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DockerfileGenerator from './components/DockerfileGenerator';
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
              Dockerfile Generator
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Welcome to the Dockerfile Generator!
              </Typography>
              <Typography variant="body1" paragraph>
                Generate production-ready Dockerfiles for your applications with proper multi-stage builds and optimized configurations. 
                Simply select your framework and customize the settings below.
              </Typography>
            </Paper>

            <DockerfileGenerator />
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
