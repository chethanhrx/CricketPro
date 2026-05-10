# CricketPro

IPL Auction Management System - Real-Time Auction Experience

CricketPro is a feature-rich auction management platform built for Indian Premier League (IPL) style franchise auctions. It provides a seamless real-time auction experience for auctioneers and team owners.

## Key Features

- **Real-Time Auction Experience**: Watch live bids, timer countdowns, and auction updates with WebSocket technology
- **Auction War Room**: Centralized dashboard for auctioneers with player queue, live bidding, and team status
- **Live Bidding System**: 
- **Auction War Room**: Centralized dashboard for auctioneers with player queue, live bidding, and team status
- **Live Bidding System**:
    - Instant bid updates across all connected clients
    - Multi-currency support (INR, USD, EUR)
    - Hype score scoring system to track auction excitement
- **Team Management**:
    - Create and manage franchise teams
    - Set budget limits and track spending
    - Assign team managers and co-owners
    - Real-time budget tracaking during auction
- **Player Management**:
    - Import and manage player database
    - Set base prices and player categories
    - Manage player availability status
- **Tournament Management**:
    - Create and configure tournaments (IPL style)
    - Set auction parameters and bidding rules
    - Create auction sessions with specific teams
- **User Authentication**:
    - Secure registration and login system
    - Role-based access control (Admin, Auctioneer, Team Owner)
    - JWT token-based authentication
- **Modern UI/UX**:
    - Premium dark theme with high-contrast accents
    - Sleek, modern interface with smooth animations
    - Responsive design for desktop and mobile devices
    - Immersive auction atmosphere with glowing effects and sounds

## Technology Stack

### Frontend
- **React 18+**: Component-based UI framework
- **React Router**: Client-side routing
- **WebSocket**: Real-time communication with backend
- **Tailwind CSS**: Utility-first styling and animations
- **Custom Design System**: Premium dark theme with gold and crimson accents, glassmorphism effects

### Backend
- **Spring Boot 3**: Java framework for building REST APIs
- **Spring Security**: Authentication and authorization
- **Spring WebSocket**: Real-time WebSocket messaging
- **JPA/Hibernate**: ORM for database interaction
- **PostgreSQL**: Relational database management system

### Database
- **PostgreSQL**: Primary database for all application data

## Project Structure

### Backend Structure

```
cricketpro/backend/
├── src/main/java/com/cricketpro/
│   ├── config/             # Spring Boot configuration
│   │   ├── SecurityConfig.java
│   │   └── WebSocketConfig.java
│   ├── controller/         # REST and WebSocket controllers
│   │   ├── AuctionController.java
│   │   ├── AuctionWebSocketController.java
│   │   ├── AuthController.java
│   │   └── TournamentController.java
│   ├── dto/                # Data Transfer Objects
│   │   ├── AuctionDTO.java
│   │   ├── AuthDTO.java
│   │   └── TournamentDTO.java
│   ├── exception/          # Global exception handling
│   │   └── GlobalExceptionHandler.java
│   ├── model/              # JPA entities
│   │   ├── Delivery.java
│   │   ├── Innings.java
│   │   ├── Match.java
│   │   ├── PlayerStats.java
│   │   ├── Tournament.java
│   │   └── ... (other entities)
│   ├── repository/         # Spring Data JPA repositories
│   │   ├── AuctionBidRepository.java
│   │   ├── AuctionPlayerQueueRepository.java
│   │   ├── AuctionSessionRepository.java
│   │   ├── TournamentRepository.java
│   │   └── ... (other repositories)
│   ├── service/            # Business logic services
│   │   ├── AuctionService.java
│   │   ├── AuctionTimerService.java
│   │   └── ... (other services)
│   ├── util/               # Utility classes
│   │   └── JwtUtil.java
│   └── CricketProApplication.java
└── pom.xml
```

### Frontend Structure

```
cricketpro/frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Auction/          # Auction-specific components
│   │   │   ├── AuctionDashboard.jsx
│   │   │   ├── BidFeed.jsx
│   │   │   ├── PlayerCard.jsx
│   │   │   ├── TeamList.jsx
│   │   │   └── Timer.jsx
│   │   ├── UI/             # General UI components
│   │   │   ├── Button.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── InputField.jsx
│   │   │   └── Navbar.jsx
│   │   └── common/           # Common layout components
│   │       └── ProtectedRoute.jsx
│   ├── pages/              # Page-level components
│   │   ├── AuctionWarRoom.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── TournamentPublic.jsx
│   ├── services/           # API client services
│   │   ├── api.js            # Axios API configuration
│   │   ├── authService.js
│   │   ├── auctionService.js
│   │   └── tournamentService.js
│   ├── styles/             # Global styles
│   │   └── designSystem.css
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Entry point
├── index.html
└── vite.config.js
```

## Installation

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/chethanhrx/CricketPro.git
   cd CricketPro/backend
   ```

2. Configure PostgreSQL database:
   - Create a database named `cricketpro`:
     ```sql
     CREATE DATABASE cricketpro;
     ```

3. Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/cricketpro
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

4. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd CricketPro/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - http://localhost:5173 - Application entry point
   - http://localhost:8080 - Backend API

## Usage

### Authentication

#### Demo Accounts (Pre-seeded)
Use these credentials to test different user roles. They are automatically created on first startup.

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Chethan | `admin@cricketpro.in` | `admin123` |
| **Organizer** | Organizer Demo | `organizer@cricketpro.in` | `organizer123` |
| **Team Owner** | Owner Royal Kings | `owner1@cricketpro.in` | `owner123` |
| **Team Owner** | Owner Thunder XI | `owner2@cricketpro.in` | `owner123` |
| **Player** | Manjunath R | `player1@cricketpro.in` | `player123` |
| **Player** | Rahul S | `player2@cricketpro.in` | `player123` |
| **Scorer** | Scorer Demo | `scorer@cricketpro.in` | `scorer123` |

#### Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password",
    "roles": ["ADMIN"]
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

Response will include an `accessToken` JWT token:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "username": "admin",
  "roles": ["ADMIN"]
}
```
