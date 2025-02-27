# Dockerfile Generator

A web application that generates production-ready Dockerfiles for various frameworks including React (Vite), Next.js, Express.js, FastAPI, and Django. Built with React, Vite, and Material UI.

## Features

- Support for multiple frameworks:
  - React with Vite
  - Next.js
  - Express.js
  - FastAPI
  - Django
- Customizable Node.js and Python versions
- Production-ready multi-stage builds
- Framework-specific optimizations
- Easy-to-follow instructions
- One-click copy functionality

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Docker (for running the containerized application)
- Docker Compose (optional, for easier deployment)

## Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd my-dockerfile-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Running with Docker

### Option 1: Using Docker Compose (Recommended)

1. Start the application:
```bash
docker compose up -d
```

2. Open your browser and visit `http://localhost:8080`

3. Stop the application:
```bash
docker compose down
```

### Option 2: Using Docker Directly

1. Build the Docker image:
```bash
docker build -t dockerfile-generator .
```

2. Run the container:
```bash
docker run -d -p 8080:80 --name dockerfile-generator dockerfile-generator
```

3. Open your browser and visit `http://localhost:8080`

4. Stop the container:
```bash
docker stop dockerfile-generator
docker rm dockerfile-generator
```

### Docker Commands Reference

- View logs:
```bash
# Using Docker Compose
docker compose logs -f

# Using Docker
docker logs -f dockerfile-generator
```

- Rebuild and restart:
```bash
# Using Docker Compose
docker compose up -d --build

# Using Docker
docker build -t dockerfile-generator .
docker stop dockerfile-generator
docker rm dockerfile-generator
docker run -d -p 8080:80 --name dockerfile-generator dockerfile-generator
```

## Project Structure

```
my-dockerfile-generator/
├── src/
│   ├── components/
│   │   └── DockerfileGenerator.tsx
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── Dockerfile
├── docker-compose.yml
├── index.html
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
