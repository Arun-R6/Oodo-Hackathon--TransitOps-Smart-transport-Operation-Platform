# TransitOps — Smart Transport Operations Platform

A full-stack transport operations platform built with **React + Spring Boot**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, React Router v6 |
| Backend | Spring Boot 3.2, Spring Security + JWT, JPA/Hibernate |
| Database | PostgreSQL 15 |
| Auth | JWT with RBAC (4 roles) |

## Quick Start

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Start the Backend
```bash
cd transitops-backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 3. Start the Frontend
```bash
cd transitops-frontend
npm run dev
# Runs on http://localhost:5173
```

## Default Login Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@transitops.com | admin123 | Fleet Manager |
| driver@transitops.com | driver123 | Driver |
| safety@transitops.com | safety123 | Safety Officer |
| finance@transitops.com | finance123 | Financial Analyst |

## Features

### Core
- ✅ JWT Authentication with RBAC
- ✅ Dashboard with KPIs (Active Vehicles, Fleet Utilization, Active Trips, etc.)
- ✅ Vehicle Registry (CRUD, unique registration number enforcement)
- ✅ Driver Management (CRUD, license expiry tracking)
- ✅ Trip Management (Draft → Dispatched → Completed/Cancelled)
- ✅ Maintenance Workflow (auto status transitions)
- ✅ Fuel & Expense Tracking
- ✅ Reports & Analytics (Fuel Efficiency, ROI, Operational Cost)
- ✅ CSV Export

### Business Rules Enforced
- Unique vehicle registration numbers
- Retired/In Shop vehicles excluded from dispatch
- Expired license / Suspended drivers blocked from dispatch
- Cargo weight validation against vehicle capacity
- Auto status transitions on dispatch, complete, cancel, maintenance

### Bonus
- ✅ Charts (Pie, Bar, Line via Recharts)
- ✅ Dark Mode
- ✅ Search & Filter on all tables
- ✅ Email reminders for expiring licenses (scheduled daily)
- ✅ CSV export for analytics

## API Endpoints

```
POST /api/auth/login
POST /api/auth/register

GET/POST       /api/vehicles
GET/PUT/DELETE /api/vehicles/{id}
GET            /api/vehicles/available

GET/POST       /api/drivers
GET/PUT/DELETE /api/drivers/{id}
GET            /api/drivers/available

GET/POST       /api/trips
POST           /api/trips/{id}/dispatch
POST           /api/trips/{id}/complete
POST           /api/trips/{id}/cancel
DELETE         /api/trips/{id}

GET/POST       /api/maintenance
POST           /api/maintenance/{id}/close
GET            /api/maintenance/vehicle/{vehicleId}

GET/POST       /api/expenses/fuel
GET/POST       /api/expenses
GET            /api/analytics/dashboard
GET            /api/analytics/vehicles
GET            /api/analytics/export/csv
```

## Project Structure

```
├── transitops-backend/          # Spring Boot API
│   └── src/main/java/com/transitops/
│       ├── entity/              # JPA entities
│       ├── repository/          # Spring Data repositories
│       ├── service/             # Business logic
│       ├── controller/          # REST controllers
│       ├── security/            # JWT + Spring Security
│       ├── dto/                 # Data transfer objects
│       └── enums/               # Status enums
│
├── transitops-frontend/         # React SPA
│   └── src/
│       ├── api/                 # Axios services
│       ├── components/          # Shared UI components
│       ├── context/             # Auth + Theme context
│       └── pages/               # Route pages
│
└── docker-compose.yml           # PostgreSQL
```
