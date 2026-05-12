# Task Management API - Secure & Deploy

A simple REST API for task management with JWT authentication, containerized with Docker and automated with CI/CD.

## Features

- **User Registration & Login** with JWT Authentication
- **Task CRUD Operations** (Create, Read, Update, Delete)
- **Protected Routes** requiring valid JWT token
- **Dockerized** for easy deployment
- **CI/CD Pipeline** using GitHub Actions
- **Unit Tests** with Jest & Supertest

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Testing:** Jest + Supertest
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Tasks (Protected - Requires JWT)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks for user | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for containerized deployment)

### Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start

# Start with hot-reload (development)
npm run dev
```

### Running Tests

```bash
npm test
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up -d --build

# Or build and run manually
docker build -t task-management-api .
docker run -d -p 3000:3000 -e JWT_SECRET=your_secret task-management-api
```

## API Usage Examples

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "password123"}'
```

**Response:**
```json
{
  "message": "User registered successfully.",
  "userId": 1
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "password123"}'
```

**Response:**
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create a Task (Protected)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Complete assignment", "description": "Finish the Docker assignment"}'
```

**Response:**
```json
{
  "message": "Task created successfully.",
  "task": {
    "id": 1,
    "userId": 1,
    "title": "Complete assignment",
    "description": "Finish the Docker assignment",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Get All Tasks (Protected)

```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Access Without Token (Denied)

```bash
curl http://localhost:3000/api/tasks
```

**Response:**
```json
{
  "error": "Access denied. No token provided."
}
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push/PR to main:

1. **Test Stage:** Installs dependencies and runs unit tests
2. **Build Stage:** Builds Docker image and performs a smoke test
3. **Deploy Stage:** Deploys using Docker Compose (on main branch only)

## Project Structure

```
Assignment-Docker/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── src/
│   ├── middleware/
│   │   └── auth.middleware.js # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.routes.js     # Login & Register endpoints
│   │   └── task.routes.js     # Task CRUD endpoints (protected)
│   ├── app.js                 # Express app configuration
│   └── index.js               # Server entry point
├── tests/
│   └── auth.test.js           # Unit tests for auth & tasks
├── .dockerignore
├── .env                       # Environment variables (not committed)
├── .gitignore
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker image definition
├── package.json
└── README.md
```

## Security Features

- Password hashing with bcryptjs (salt rounds: 10)
- JWT token-based authentication
- Protected routes with middleware verification
- Environment variable configuration for secrets
- No sensitive data in Docker image

## License

ISC
