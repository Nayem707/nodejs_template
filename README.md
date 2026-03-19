# Express Backend Boilerplate

A production-ready Node.js + Express backend boilerplate with authentication, database integration, and modern development practices.

## 🚀 Features

- **Framework**: Express.js with ES6 modules
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: JWT with access & refresh token system
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston with structured logging
- **Code Quality**: ESLint + Prettier configuration
- **Error Handling**: Centralized error handling with custom error classes
- **Development**: Hot reload with nodemon
- **Production Ready**: Graceful shutdown, health checks, and monitoring

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   ├── config.js           # Environment configuration
│   │   └── database.js         # Prisma database setup
│   ├── controllers/
│   │   └── authController.js   # Authentication controllers
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   └── notFound.js         # 404 handler
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── testRoutes.js       # Test and health routes
│   │   └── index.js            # Route aggregator
│   ├── services/
│   │   └── authService.js      # Authentication business logic
│   ├── utils/
│   │   ├── ApiError.js         # Custom error class
│   │   ├── ApiResponse.js      # Standardized API responses
│   │   ├── asyncHandler.js     # Async error handling wrapper
│   │   ├── jwt.js              # JWT utilities
│   │   └── logger.js           # Winston logger setup
│   └── server.js               # Express server entry point
├── prisma/
│   └── schema.prisma           # Database schema
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- npm or yarn package manager

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the `.env` file and update the values:

```bash
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"

# JWT Configuration (Change these in production!)
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create and run migrations (for production)
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Create and run database migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/auth/logout` | Logout user | ❌ |
| GET | `/api/auth/me` | Get user profile | ✅ |
| POST | `/api/auth/logout-all` | Logout from all devices | ✅ |

### Test Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | ❌ |
| GET | `/api/test/protected` | Protected route test | ✅ |

### Root Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |

## 🔑 Authentication Flow

### Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Accessing Protected Routes

```bash
curl -X GET http://localhost:3000/api/auth/me \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Token Refresh

```bash
curl -X POST http://localhost:3000/api/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents API abuse
- **JWT Security**: Separate access and refresh tokens
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Request validation and sanitization
- **Error Handling**: No sensitive data in error responses

## 📊 Logging & Monitoring

### Health Check

Visit `http://localhost:3000/api/health` to see:

```json
{
  "success": true,
  "message": "System is healthy",
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456,
    "environment": "development",
    "database": "connected",
    "memory": {
      "used": 45.67,
      "total": 89.12
    }
  }
}
```

### Log Levels

- **Error**: Application errors and exceptions
- **Warn**: Warning messages
- **Info**: General application flow
- **Debug**: Detailed debugging (development only)

## 🚀 Production Deployment

### Environment Variables

Ensure all production environment variables are set:

```bash
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_ACCESS_SECRET=your_secure_access_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
```

### Database Migration

```bash
npm run db:migrate
```

### Start Production Server

```bash
npm start
```

### Process Management

Consider using PM2 for production process management:

```bash
npm install -g pm2
pm2 start src/server.js --name "express-backend"
pm2 startup
pm2 save
```

## 🧪 Testing

### Manual Testing

1. **Health Check**: `GET /api/health`
2. **Register User**: `POST /api/auth/register`
3. **Login**: `POST /api/auth/login`
4. **Access Protected Route**: `GET /api/test/protected`
5. **Refresh Token**: `POST /api/auth/refresh`

### Using Postman/Thunder Client

Import the API endpoints or use the curl examples provided above.

## 🛠️ Customization

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create service in `src/services/` (if needed)
3. Create route file in `src/routes/`
4. Add route to `src/routes/index.js`

### Adding Middleware

1. Create middleware in `src/middleware/`
2. Apply globally in `src/server.js` or per route

### Database Schema Changes

1. Modify `prisma/schema.prisma`
2. Run `npm run db:migrate` or `npm run db:push`
3. Generate new client with `npm run db:generate`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **JWT Token Issues**
   - Check JWT secrets in .env
   - Verify token expiration settings
   - Ensure proper Authorization header format

3. **Port Already in Use**
   - Change PORT in .env file
   - Or kill process using the port

### Debug Mode

Set `NODE_ENV=development` for detailed logging and error messages.

## 📚 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Helmet, CORS, bcrypt
- **Logging**: Winston
- **Code Quality**: ESLint, Prettier
- **Development**: Nodemon

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

## 🎯 Next Steps

After setting up the boilerplate, consider adding:

- [ ] Input validation with Joi or Zod
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] User roles and permissions
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Monitoring and metrics
- [ ] File upload functionality

Happy coding! 🚀# nodejs_template
