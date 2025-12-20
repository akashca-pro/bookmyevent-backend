<p align="center">
  <h1 align="center">BookMyEvent Backend</h1>
  <p align="center">
    A robust, production-ready RESTful API for event service booking and management
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-Latest-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📖 Overview

**BookMyEvent Backend** is a scalable event booking platform API that enables users to discover and book various event services while providing administrators with powerful management capabilities. Built with clean architecture principles and industry best practices.

---

## Features

### Authentication & Authorization

- JWT-based authentication with HTTP-only cookies
- Role-based access control (User / Admin)
- Secure password hashing with bcrypt

### Service Management (Admin)

- Create, update, and manage event services
- Category management for service organization
- Image upload support via Cloudinary
- Service availability tracking

### Booking System

- Real-time service availability checking
- Reservation with automatic timeout (booking locks)
- Booking confirmation workflow
- Monthly availability calendar view
- Booking status management (Reserved → Confirmed → Cancelled)

### Performance & Reliability

- Redis caching for profiles, services, bookings, and categories
- Structured logging with Pino
- Automated booking cleanup via cron jobs
- Request validation with Zod schemas

### Developer Experience

- OpenAPI/Swagger documentation
- TypeScript with strict type safety
- Dependency injection with InversifyJS
- ESLint + Prettier for code quality

---

## 🛠 Tech Stack

| Category                 | Technology             |
| ------------------------ | ---------------------- |
| **Runtime**              | Node.js 20+            |
| **Framework**            | Express 5.x            |
| **Language**             | TypeScript 5.x         |
| **Database**             | MongoDB (Mongoose 6.x) |
| **Caching**              | Redis (ioredis)        |
| **Authentication**       | JWT (jsonwebtoken)     |
| **Validation**           | Zod                    |
| **File Upload**          | Multer + Cloudinary    |
| **Documentation**        | Swagger/OpenAPI        |
| **Logging**              | Pino                   |
| **Dependency Injection** | InversifyJS            |
| **Build Tool**           | tsup                   |

---

## Project Structure

```
src/
├── config/           # Configuration (database, env, swagger)
├── const/            # Constants and enums
├── db/
│   ├── interfaces/   # Database interfaces
│   └── models/       # Mongoose models (User, Service, Booking, Category)
├── dtos/             # Data Transfer Objects
├── jobs/             # Cron jobs (booking cleanup)
├── presentation/
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # JWT auth, validation, file upload
│   └── routes/       # API route definitions
├── providers/        # External services (Redis, JWT, Password hasher)
├── repos/            # Repository pattern implementations
├── services/         # Business logic layer
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (logging, error handling)
├── validation/       # Zod schemas for request validation
└── index.ts          # Application entry point
```

---

## Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** or **yarn**
- **MongoDB** instance (local or Atlas)
- **Redis** instance
- **Cloudinary** account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bookmyevent-backend.git
   cd bookmyevent-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration**

   ```env
   # Application
   SERVICE_NAME=BOOK_MY_EVENT_BACKEND
   NODE_ENV=development
   PORT=9000

   # Client / CORS
   CLIENT_URL=http://localhost:5173

   # Database
   DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db_name>

   # Redis
   REDIS_URL=redis://localhost:6379

   # Authentication
   JWT_ACCESS_TOKEN_SECRET=your_secure_jwt_secret
   JWT_ACCESS_TOKEN_EXPIRY=1d

   # Cache Expiry (in seconds)
   PROFILE_CACHE_EXPIRY=86400
   SERVICE_CACHE_EXPIRY=86400
   BOOKING_CACHE_EXPIRY=86400
   CATEGORY_CACHE_EXPIRY=86400

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Booking Lock
   BOOKING_LOCK_TIMEOUT=30
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:9000`

### Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build for production                     |
| `npm start`     | Run production build                     |
| `npm run lint`  | Run ESLint                               |

---

## API Documentation

### Interactive Swagger UI

Once the server is running, access the API documentation at:

```
http://localhost:9000/doc
```

### OpenAPI Specification

Download the OpenAPI JSON schema:

```
http://localhost:9000/openapi.json
```

### API Endpoints Overview

#### Authentication (`/api/v1/auth`)

| Method | Endpoint       | Description       | Auth |
| ------ | -------------- | ----------------- | ---- |
| POST   | `/signup`      | User registration | ❌   |
| POST   | `/user/login`  | User login        | ❌   |
| POST   | `/admin/login` | Admin login       | ❌   |
| DELETE | `/logout`      | Logout            | 🔒   |

#### Profile (`/api/v1/profile`)

| Method | Endpoint | Description              | Auth |
| ------ | -------- | ------------------------ | ---- |
| GET    | `/`      | Get current user profile | 🔒   |

#### Services (`/api/v1/services`)

| Method | Endpoint               | Description            | Auth     |
| ------ | ---------------------- | ---------------------- | -------- |
| GET    | `/available`           | Get available services | ❌       |
| GET    | `/:serviceId`          | Get service details    | ❌       |
| POST   | `/create`              | Create new service     | 🔒 Admin |
| PATCH  | `/:serviceId/update`   | Update service         | 🔒 Admin |
| GET    | `/`                    | Get all services       | 🔒 Admin |
| GET    | `/:serviceId/bookings` | Get service bookings   | 🔒 Admin |

#### Bookings (`/api/v1/bookings`)

| Method | Endpoint                                       | Description          | Auth    |
| ------ | ---------------------------------------------- | -------------------- | ------- |
| POST   | `/services/:serviceId/book/reserve`            | Reserve booking      | 🔒 User |
| POST   | `/services/:serviceId/book/:bookingId/confirm` | Confirm booking      | 🔒 User |
| GET    | `/:bookingId`                                  | Get booking details  | 🔒 User |
| GET    | `/`                                            | Get user bookings    | 🔒 User |
| POST   | `/:bookingId/cancel`                           | Cancel booking       | 🔒 User |
| GET    | `/:serviceId/checkAvailability`                | Check availability   | 🔒 User |
| GET    | `/services/:serviceId/availability`            | Monthly availability | 🔒 User |

#### Categories (`/api/v1/categories`)

| Method | Endpoint              | Description        | Auth     |
| ------ | --------------------- | ------------------ | -------- |
| POST   | `/create`             | Create category    | 🔒 Admin |
| GET    | `/`                   | Get all categories | 🔒 Admin |
| GET    | `/:categoryId`        | Get category       | 🔒 Admin |
| PATCH  | `/:categoryId/update` | Update category    | 🔒 Admin |
| DELETE | `/:categoryId/delete` | Delete category    | 🔒 Admin |

**Legend:** ❌ Public | 🔒 Authenticated | 🔒 Admin = Admin role required | 🔒 User = User role required

---

## Docker

### Build and Run with Docker

```bash
# Build the image
docker build -t bookmyevent-backend .

# Run the container
docker run -p 9000:9000 --env-file .env bookmyevent-backend
```

### Using Docker Compose

```bash
docker-compose up
```

### Multi-stage Dockerfile

The project uses a multi-stage Docker build for optimized production images:

1. **Builder Stage**: Compiles TypeScript and generates Swagger docs
2. **Runtime Stage**: Minimal Node.js Alpine image with only production assets

---

## Deployment

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. Builds and pushes Docker image to Docker Hub
2. Deploys to Google Cloud Run

### Required GitHub Secrets

| Secret               | Description                  |
| -------------------- | ---------------------------- |
| `DOCKERHUB_USERNAME` | Docker Hub username          |
| `DOCKERHUB_TOKEN`    | Docker Hub access token      |
| `GCP_SA_KEY`         | GCP service account JSON key |

### Manual Deployment to Cloud Run

```bash
gcloud run deploy bookmyevent \
  --image docker.io/<your-username>/bookmyevent:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 9000
```

---

## Security

- **HTTP-only Cookies**: JWT tokens stored in secure HTTP-only cookies
- **Helmet**: Security headers middleware
- **CORS**: Configured origin restrictions
- **Bcrypt**: Password hashing with salt rounds
- **Input Validation**: Zod schema validation on all endpoints
- **Role-based Access**: Admin and User role separation

---

## 🩺 Health Check

The API exposes a health check endpoint for monitoring:

```bash
GET /health
```

Response:

```json
{
  "status": "OK"
}
```

---

## License

This project is licensed under the ISC License.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ for event booking
</p>
