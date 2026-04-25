#!/bin/bash

# 🎓 AlumniLink - Quick Start Script
# This script automates the setup process

echo "🚀 Starting AlumniLink Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install it from https://nodejs.org${NC}"
    exit 1
fi

echo -e "${BLUE}✓ Node.js is installed$(node -v)${NC}"
echo ""

# Backend Setup
echo -e "${BLUE}Setting up Backend...${NC}"
cd backend
echo "Installing backend dependencies..."
npm install

echo ""
echo -e "${GREEN}✓ Backend setup complete!${NC}"
echo ""

# Frontend Setup
cd ../frontend
echo -e "${BLUE}Setting up Frontend...${NC}"
echo "Installing frontend dependencies..."
npm install

echo ""
echo -e "${GREEN}✓ Frontend setup complete!${NC}"
echo ""

# Summary
echo "🎉 Setup Complete!"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Ensure MongoDB is running"
echo "2. Update backend/.env with your MongoDB URI"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "📝 For detailed instructions, see SETUP.md"
