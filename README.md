# SOLEMATE E-commerce Microservices

A modern microservices-based e-commerce platform for shoe retail, built with Node.js, React, and PostgreSQL.

## 🏗️ Architecture Overview

SOLEMATE is being migrated from a monolithic PERN stack to a distributed microservices architecture over 30 days. Each service is containerized with Docker and communicates via REST APIs.

### Tech Stack
- **Frontend**: React
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Supabase)
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT
- **API Gateway**: TBD

## 📦 Services

### ✅ User Service (Day 1) - COMPLETED
- **Port**: 3001
- **Responsibilities**: User authentication, registration, profile management
- **Status**: Basic structure implemented and running
- **Endpoints**:
  - `GET /` - Service health check
  - `GET /health` - Detailed health status

### 🚧 Upcoming Services

- **Product Service** (Day 2-5): Product catalog, images, sizes, categories
- **Order Service** (Day 6-10): Order processing, order details
- **Payment Service** (Day 11-15): Payment processing and tracking
- **Cart Service** (Day 16-20): Shopping cart management
- **Search Service** (Day 21-25): Product search and filtering
- **API Gateway** (Day 26-30): Request routing and authentication

## 🗄️ Database Schema

### Current Tables
- `users` (User Service)
  - u_id (varchar) - Primary Key
  - is_admin (bpchar)
  - first_name (varchar)
  - last_name (varchar)
  - email (varchar) - Unique
  - password (varchar)
  - phone_number (numerical)
  - created_at (timestamp) - Added
  - updated_at (timestamp) - Added
  - deleted_at (timestamp) - Added (soft delete)

- `product` (Product Service)
- `P_Images` (Product Service)
- `P_Size` (Product Service)
- `category` (Product Service)
- `Order` (Order Service)
- `order_details` (Order Service)
- `payment` (Payment Service)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Access to Supabase PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zain4391/solemate-microservices.git
   cd solemate-microservices
   ```

2. **Set up Services**
   ```bash
   cd <service-name>
   touch .env
   # Contact repository owner for .env credentials
   npm install
   npm run dev  # Development-service
   ```

3. **Run with Docker**
   ```bash
   # From project root
   docker-compose up --build
   ```

4. **Verify services**
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   ```

## 🔧 Development

### Running Individual Services

**User Service:**
```bash
cd user-service
npm install
npm run dev  # Development mode
npm start    # Production mode
```

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs user-service

# Rebuild after changes
docker-compose up --build --force-recreate
```


## 📊 Service Communication

### Authentication Flow
1. Client requests authentication via API Gateway
2. API Gateway routes to User Service
3. User Service validates credentials
4. JWT token returned for subsequent requests

### Inter-Service Communication
- **Synchronous**: REST APIs for real-time operations
- **Asynchronous**: Event-driven communication (planned)
- **Service Discovery**: Docker Compose networking

## 🔒 Security

- JWT-based authentication
- Input validation and sanitization
- Rate limiting -  to be done
- CORS configuration
- Environment-based configuration

## 📈 Monitoring & Logging

- Health check endpoints for all services
- Structured logging with Winston
- Docker container monitoring
- Performance metrics (planned)

## 🚢 Deployment

### Development
Services run locally using Docker Compose with hot reloading.

### Production (Planned)
- Container orchestration with Kubernetes
- CI/CD pipeline setup
- Environment-specific configurations
- Load balancing and scaling


## 🤝 Contributing

1. Each service should be developed incrementally
2. Follow RESTful API conventions
3. Implement proper error handling
