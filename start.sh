#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# CricketPro — Start Script
# Starts both backend (Spring Boot) and frontend (React/Vite)
# Usage: ./start.sh
# ═══════════════════════════════════════════════════════════════

set -e

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# PIDs to track background processes
BACKEND_PID=""
FRONTEND_PID=""

# ── Cleanup on exit ──
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down CricketPro...${NC}"
    
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo -e "${BLUE}   Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill "$BACKEND_PID" 2>/dev/null
        wait "$BACKEND_PID" 2>/dev/null
    fi
    
    if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo -e "${BLUE}   Stopping frontend (PID: $FRONTEND_PID)...${NC}"
        kill "$FRONTEND_PID" 2>/dev/null
        wait "$FRONTEND_PID" 2>/dev/null
    fi
    
    echo -e "${GREEN}✅ CricketPro stopped. See you on the pitch! 🏏${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# ── Banner ──
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════╗"
echo "║          🏏 CricketPro — Starting Up            ║"
echo "║     Live Auction War Room • Cricket Platform     ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Check prerequisites ──
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found. Install with: sudo apt install default-jdk${NC}"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} Java: $(java --version 2>&1 | head -1)"

if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven not found. Install with: sudo apt install maven${NC}"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} Maven: $(mvn --version 2>&1 | head -1)"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Install from: https://nodejs.org${NC}"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} Node: $(node --version)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found.${NC}"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} npm: $(npm --version)"

echo ""

# ── Step 1: Install frontend dependencies if needed ──
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies (first time setup)...${NC}"
    cd "$FRONTEND_DIR"
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    echo ""
fi

# ── Step 2: Start Backend (Spring Boot) ──
echo -e "${BLUE}🚀 Starting backend (Spring Boot on port 8080)...${NC}"
cd "$BACKEND_DIR"

# Build and run Spring Boot in the background
mvn spring-boot:run -Dmaven.repo.local="$PROJECT_DIR/.m2/repository" -q -DskipTests &
BACKEND_PID=$!

echo -e "   ${GREEN}✓${NC} Backend starting (PID: $BACKEND_PID)"
echo ""

# Wait a few seconds for backend to initialize
echo -e "${YELLOW}⏳ Waiting for backend to start (this may take 30-60s on first run)...${NC}"
sleep 5

# ── Step 3: Start Frontend (Vite dev server) ──
echo -e "${BLUE}🎨 Starting frontend (Vite on port 5173)...${NC}"
cd "$FRONTEND_DIR"

npx vite --host &
FRONTEND_PID=$!

echo -e "   ${GREEN}✓${NC} Frontend starting (PID: $FRONTEND_PID)"
echo ""

# ── Ready ──
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════╗"
echo "║           🏏 CricketPro is RUNNING!             ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║                                                  ║"
echo "║  Frontend:  http://localhost:5173                ║"
echo "║  Backend:   http://localhost:8080                ║"
echo "║  H2 Console: http://localhost:8080/h2-console   ║"
echo "║                                                  ║"
echo "║  War Room:  http://localhost:5173/auction/live/1 ║"
echo "║  Login:     http://localhost:5173/login          ║"
echo "║  Register:  http://localhost:5173/register       ║"
echo "║                                                  ║"
echo "║  Press Ctrl+C to stop all services               ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Keep script running and wait for both processes
wait
