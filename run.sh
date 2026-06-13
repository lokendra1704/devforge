#!/bin/bash

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored output
print_header() {
  echo -e "${BLUE}➜${NC} $1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Check if node_modules exists, install if needed
if [ ! -d "node_modules" ]; then
  print_header "Installing dependencies..."
  npm install
  print_success "Dependencies installed"
fi

# Default to dev if no argument provided
COMMAND="${1:-dev}"

case "$COMMAND" in
  dev)
    print_header "Starting development server..."
    npm run dev
    ;;
  build)
    print_header "Building project..."
    npm run build
    print_success "Build complete"
    ;;
  lint)
    print_header "Running linter..."
    npm run lint
    ;;
  preview)
    print_header "Starting preview server..."
    npm run preview
    ;;
  *)
    print_error "Unknown command: $COMMAND"
    echo ""
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  dev      - Start development server (default)"
    echo "  build    - Build for production"
    echo "  lint     - Run eslint"
    echo "  preview  - Preview production build"
    echo ""
    exit 1
    ;;
esac
