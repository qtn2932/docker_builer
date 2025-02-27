import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography,
  Tooltip,
  IconButton,
  Box,
  FormHelperText,
  Alert,
  Snackbar
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const DockerfileGenerator: React.FC = () => {
  const [framework, setFramework] = useState('');
  const [nodeVersion, setNodeVersion] = useState('20-alpine');
  const [pythonVersion, setPythonVersion] = useState('3.11-slim');
  const [dockerfile, setDockerfile] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Reset dockerfile when framework changes
  useEffect(() => {
    setDockerfile('');
  }, [framework]);

  const generateReactViteDockerfile = (nodeVersion: string) => {
    return `# Build stage
FROM node:${nodeVersion} AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source code files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]`;
  };

  const generateNextJsDockerfile = (nodeVersion: string) => {
    return `# Build stage
FROM node:${nodeVersion} AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source code files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:${nodeVersion}-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built application
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./next.config.js

# Expose port 3000
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]`;
  };

  const generateExpressDockerfile = (nodeVersion: string) => {
    return `# Build stage
FROM node:${nodeVersion} AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Production stage
FROM node:${nodeVersion}-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=build /app/package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy application files
COPY --from=build /app/src ./src
COPY --from=build /app/dist ./dist

# Set NODE_ENV
ENV NODE_ENV=production

# Expose default Express port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]`;
  };

  const generateFastAPIDockerfile = (pythonVersion: string) => {
    return `# Use Python base image
FROM python:${pythonVersion}

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app ./app

# Expose port
EXPOSE 8000

# Start the application with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`;
  };

  const generateDjangoDockerfile = (pythonVersion: string) => {
    return `# Use Python base image
FROM python:${pythonVersion}

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    DJANGO_SETTINGS_MODULE=core.settings

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    libpq-dev \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]`;
  };

  const handleGenerate = () => {
    switch (framework) {
      case 'react-vite':
        setDockerfile(generateReactViteDockerfile(nodeVersion));
        break;
      case 'nextjs':
        setDockerfile(generateNextJsDockerfile(nodeVersion));
        break;
      case 'express':
        setDockerfile(generateExpressDockerfile(nodeVersion));
        break;
      case 'fastapi':
        setDockerfile(generateFastAPIDockerfile(pythonVersion));
        break;
      case 'django':
        setDockerfile(generateDjangoDockerfile(pythonVersion));
        break;
      default:
        setDockerfile('# Please select a framework');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dockerfile);
      setShowCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderFormLabel = (label: string, tooltip: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {label}
      <Tooltip title={tooltip} arrow placement="top">
        <IconButton size="small">
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const isPythonFramework = (fw: string) => fw === 'fastapi' || fw === 'django';
  const isNodeFramework = (fw: string) => fw === 'react-vite' || fw === 'nextjs' || fw === 'express';

  return (
    <div>
      <Typography variant="h4" gutterBottom>Dockerfile Generator</Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>
          {renderFormLabel(
            "Framework",
            "Select your application framework"
          )}
        </InputLabel>
        <Select
          value={framework}
          onChange={(e) => setFramework(e.target.value)}
        >
          <MenuItem value="react-vite">React with Vite</MenuItem>
          <MenuItem value="nextjs">Next.js</MenuItem>
          <MenuItem value="express">Express.js</MenuItem>
          <MenuItem value="fastapi">FastAPI</MenuItem>
          <MenuItem value="django">Django</MenuItem>
        </Select>
        <FormHelperText>Select your project framework</FormHelperText>
      </FormControl>

      {isNodeFramework(framework) && (
        <FormControl fullWidth margin="normal">
          <TextField
            label={renderFormLabel(
              "Node Version",
              "Specify the Node.js version for the build environment"
            )}
            value={nodeVersion}
            onChange={(e) => setNodeVersion(e.target.value)}
            placeholder="20-alpine"
            helperText="Examples: 20-alpine, 18-alpine, 16"
          />
        </FormControl>
      )}

      {isPythonFramework(framework) && (
        <FormControl fullWidth margin="normal">
          <TextField
            label={renderFormLabel(
              "Python Version",
              "Specify the Python version for the environment"
            )}
            value={pythonVersion}
            onChange={(e) => setPythonVersion(e.target.value)}
            placeholder="3.11-slim"
            helperText="Examples: 3.11-slim, 3.10-slim, 3.9-alpine"
          />
        </FormControl>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGenerate}
        sx={{ mt: 2 }}
        disabled={!framework}
      >
        Generate Dockerfile
      </Button>

      {dockerfile && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Generated Dockerfile</Typography>
            <Tooltip title="Copy Dockerfile">
              <IconButton onClick={handleCopy} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box 
            component="pre" 
            sx={{ 
              bgcolor: '#1a1a1a', 
              color: '#fff', 
              p: 2, 
              borderRadius: 1,
              overflow: 'auto',
              fontFamily: 'monospace'
            }}
          >
            {dockerfile}
          </Box>

          <Box sx={{ mt: 3, bgcolor: '#ffffff', p: 3, borderRadius: 1, boxShadow: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
              How to use this Dockerfile:
            </Typography>
            <Typography variant="body1" component="div" sx={{ color: '#2c3e50' }}>
              <ol style={{ marginLeft: '1rem', lineHeight: '1.8' }}>
                <li>Create a new file named <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>Dockerfile</code> (no extension) in your {
                  framework === 'react-vite' 
                    ? 'React Vite' 
                    : framework === 'nextjs'
                    ? 'Next.js'
                    : framework === 'express'
                    ? 'Express.js'
                    : framework === 'fastapi'
                    ? 'FastAPI'
                    : 'Django'
                } project's root directory</li>
                <li>Copy the generated content into the Dockerfile</li>
                <li>Open a terminal in your project directory</li>
                <li>Build the Docker image:
                  <Box component="pre" sx={{ 
                    bgcolor: '#1a1a1a', 
                    color: '#fff', 
                    p: 2, 
                    borderRadius: 1, 
                    mt: 1, 
                    mb: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    position: 'relative'
                  }}>
                    docker build -t my-{framework}-app .
                  </Box>
                </li>
                <li>Run the container:
                  <Box component="pre" sx={{ 
                    bgcolor: '#1a1a1a', 
                    color: '#fff', 
                    p: 2, 
                    borderRadius: 1, 
                    mt: 1, 
                    mb: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    position: 'relative'
                  }}>
                    docker run -p {
                      framework === 'react-vite' 
                        ? '8080:80' 
                        : framework === 'fastapi' || framework === 'django'
                        ? '8000:8000'
                        : '3000:3000'
                    } my-{framework}-app
                  </Box>
                </li>
                <li>Visit <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>http://localhost:{
                  framework === 'react-vite' 
                    ? '8080'
                    : framework === 'fastapi' || framework === 'django'
                    ? '8000'
                    : '3000'
                }</code> in your browser</li>
              </ol>
            </Typography>
          </Box>
        </Box>
      )}

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Dockerfile copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DockerfileGenerator; 