# Carbon Footprint Monitoring System

**Infosys Internship Milestone 1 Project**

A secure, scalable full-stack web application for Carbon Footprint Monitoring with enterprise-level authentication, role-based access control, and admin approval workflow.

---

## Technology Stack

### Backend
- **Java 21** + **Spring Boot 3.3.2**
- **Spring Security 6** + **JJWT 0.12.6** (JWT Authentication)
- **Spring Data JPA** / **Hibernate** + **PostgreSQL**
- **BCrypt Password Encoding** + **Lombok**
- **Spring Mail** (Email Dispatch)
- **Maven**

### Frontend
- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **React Router 6**
- **Axios** (with JWT interceptors)
- **Recharts** (Dashboard analytics charts)
- **Lucide React** (Icons)

### Database
- **PostgreSQL** (`carbonfootprint` database, 3NF normalized schema)

---

## Project Structure

```
carbon_footprint/
├── carbon-footprint-backend/     # Spring Boot Backend (Port 8080)
└── carbon-footprint-frontend/    # React + Vite Frontend (Port 5173)
```

---

## Quick Start

### Prerequisites
- Java 21
- Maven 3.9+
- Node.js 18+
- PostgreSQL running on localhost:5432

### 1. Start Backend
```bash
cd carbon-footprint-backend
mvn spring-boot:run
```

### 2. Start Frontend (new terminal)
```bash
cd carbon-footprint-frontend
npm run dev
```

### Access
| URL | Description |
|-----|-------------|
| http://localhost:5173 | Landing Page |
| http://localhost:5173/register | User Registration |
| http://localhost:5173/login | User Login |
| http://localhost:5173/admin/login | Admin Login |
| http://localhost:5173/admin/dashboard | Admin Dashboard |
| http://localhost:8080/api/v1/auth/register | REST API |

---

## Default Admin Credentials
```
Email:    admin@infosys.com
Password: admin123
```

---

## API Endpoints

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/api/v1/auth/admin/login` | Admin Login | Public |
| POST | `/api/v1/auth/user/login` | User Login | Public |
| POST | `/api/v1/auth/register` | User Registration | Public |
| POST | `/api/v1/auth/reset-password/{userId}` | Password Reset | JWT |
| GET | `/api/v1/admin/dashboard` | Dashboard Statistics | ADMIN |
| GET | `/api/v1/admin/users` | All Users | ADMIN |
| GET | `/api/v1/admin/users/status/{status}` | Filter by Status | ADMIN |
| POST | `/api/v1/admin/users/{id}/approve` | Approve User | ADMIN |
| POST | `/api/v1/admin/users/{id}/reject` | Reject User | ADMIN |
| GET | `/api/v1/user/profile` | Current User Profile | USER/ADMIN |

---

## Git Branch Strategy
- `main` — production-ready stable releases
- `develop` — active development integration
- `feature/backend-auth` — backend authentication feature
- `feature/frontend-ui` — frontend pages and components
- `feature/admin-approval` — admin approval workflow

---

## Database Configuration (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/carbonfootprint
spring.datasource.username=postgres
spring.datasource.password=post@123
```

---

## Author
Infosys Spring 2026 Internship Batch
