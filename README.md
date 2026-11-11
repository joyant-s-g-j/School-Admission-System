# School Admission System

A full-stack school admission management system built with ASP.NET Core Web API, React, and PostgreSQL. Students can apply for admission, temporarily reserve seats, complete simulated payments, and track their applications. Administrators can create classes and monitor seat availability.

## Project Structure

```text
SchoolAdmission/
├── backend/
│   └── SchoolAdmission/
│       ├── Controllers/
│       │   ├── ClassesController.cs
│       │   └── HoldsController.cs
│       ├── Data/
│       │   └── ApplicationDbContext.cs
│       ├── DTOs/
│       ├── Migrations/
│       ├── Models/
│       ├── Services/
│       │   └── HoldExpirationService.cs
│       ├── SchoolAdmission.Tests/
│       ├── Program.cs
│       ├── SchoolAdmission.csproj
│       └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── README.md
├── ASSUMPTIONS.md
└── AI_USAGE.md
```

## Tech Stack

| Area | Technology |
|---|---|
| Backend | ASP.NET Core Web API (.NET 10) |
| ORM | Entity Framework Core |
| Database | PostgreSQL |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx |
| Testing | xUnit |

## Features

### Student
- Apply using a 17-digit Birth Registration Number.
- View available classes and remaining seats.
- Temporarily reserve an available seat.
- Track application status and reservation countdown.
- Confirm admission using simulated payment.
- Cancel an active reservation.
- View previous and current applications.
- Restore student information after browser refresh.

### Admin
- Create classes with class name, shift, and seat capacity.
- View classes and seat availability.

### System
- Prevents seat overbooking during concurrent requests.
- Enforces reservation and admission rules at the database level.
- Automatically expires unpaid reservations.
- Persists application data in PostgreSQL.
- Refreshes class and application information periodically.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Run the Application

Clone the repository:

```bash
git clone https://github.com/joyant-s-g-j/School-Admission-System.git
cd School-Admission-System
```

Start the application:

```bash
docker compose up
```

This command builds the required images if needed and starts the frontend, backend, and PostgreSQL database services.

Application URLs:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Stop the application using `Ctrl + C` in the terminal, then run:

```bash
docker compose down
```

PostgreSQL data is stored in a named Docker volume and is preserved when containers are stopped or recreated.

**Important:** Avoid `docker compose down -v` unless you intentionally want to delete the database volume and its data.

## Environment Variables

### Backend

| Variable | Description | Default |
|---|---|---|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string | — |
| `HOLD_DURATION_SECONDS` | Reservation duration in seconds | `600` |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/classes` | Create a class |
| GET | `/classes` | Retrieve all classes |
| GET | `/classes/{classId}` | Retrieve class details |
| POST | `/classes/{classId}/holds` | Reserve a seat |
| GET | `/holds/{holdId}` | Retrieve reservation details |
| POST | `/holds/{holdId}/confirm` | Confirm admission |
| DELETE | `/holds/{holdId}` | Cancel a reservation |
| GET | `/me/holds` | Retrieve the student's reservations |

Student-specific requests require the `X-Student-Id` header containing a 17-digit Birth Registration Number.

## Running Tests

From the repository root:

```bash
dotnet test backend/SchoolAdmission/SchoolAdmission.Tests/SchoolAdmission.Tests.csproj
```

The automated backend tests cover reservation behavior, admission rules, and concurrent seat reservation scenarios.

## Reservation Workflow

1. A student selects a class.
2. The backend checks seat availability and creates a temporary reservation.
3. The student completes the simulated payment before the reservation expires.
4. The reservation is confirmed and the seat is allocated.
5. Expired or cancelled reservations release their seats.

## Scope

- Payments are simulated; no real payment gateway is integrated.
- No login or password-based authentication is required.
- No email or SMS notification service is included.
