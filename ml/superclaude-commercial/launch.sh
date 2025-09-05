#!/bin/bash

# 🚀 Persona AI - Launch Script
# This script helps you get started with the commercial SuperClaude application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}🚀 Persona AI${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "Node.js version $(node --version) is compatible"
            return 0
        else
            print_error "Node.js version $(node --version) is too old. Please install Node.js 18+"
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+"
        return 1
    fi
}

# Function to check if Ollama is installed and running
check_ollama() {
    if command_exists ollama; then
        if ollama list >/dev/null 2>&1; then
            print_success "Ollama is installed and running"
            return 0
        else
            print_warning "Ollama is installed but not running. Starting Ollama..."
            ollama serve &
            sleep 5
            if ollama list >/dev/null 2>&1; then
                print_success "Ollama is now running"
                return 0
            else
                print_error "Failed to start Ollama"
                return 1
            fi
        fi
    else
        print_error "Ollama is not installed. Please install Ollama from https://ollama.ai"
        return 1
    fi
}

# Function to install required AI models
install_ai_models() {
    print_status "Installing required AI models..."
    
    MODELS=("llama3.2" "codellama:7b" "mistral:7b")
    
    for model in "${MODELS[@]}"; do
        if ollama list | grep -q "$model"; then
            print_success "Model $model is already installed"
        else
            print_status "Installing model $model..."
            ollama pull "$model" &
        fi
    done
    
    # Wait for all models to finish downloading
    wait
    print_success "All AI models installed successfully"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env.local ]; then
        if [ -f .env.example ]; then
            cp .env.example .env.local
            print_success "Created .env.local from .env.example"
            print_warning "Please edit .env.local with your configuration"
        else
            print_warning "No .env.example found. Creating basic .env.local..."
            cat > .env.local << EOF
# SuperClaude Commercial Environment Variables

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/superclaude"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI Models
OLLAMA_BASE_URL="http://localhost:11434"
DEFAULT_MODEL="llama3.2"

# Redis (for caching and queues)
REDIS_URL="redis://localhost:6379"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EOF
            print_success "Created basic .env.local"
            print_warning "Please edit .env.local with your actual configuration"
        fi
    else
        print_success ".env.local already exists"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if command_exists pnpm; then
        print_status "Using pnpm package manager"
        pnpm install
    elif command_exists npm; then
        print_status "Using npm package manager"
        npm install
    else
        print_error "Neither pnpm nor npm is installed"
        exit 1
    fi
    
    print_success "Dependencies installed successfully"
}

# Function to start development server
start_development() {
    print_status "Starting SuperClaude Commercial development server..."
    
    if command_exists pnpm; then
        pnpm dev
    elif command_exists npm; then
        npm run dev
    else
        print_error "Neither pnpm nor npm is available"
        exit 1
    fi
}

# Function to build for production
build_production() {
    print_status "Building SuperClaude Commercial for production..."
    
    if command_exists pnpm; then
        pnpm build
    elif command_exists npm; then
        npm run build
    else
        print_error "Neither pnpm nor npm is available"
        exit 1
    fi
    
    print_success "Build completed successfully"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if command_exists pnpm; then
        pnpm test
    elif command_exists npm; then
        npm test
    else
        print_error "Neither pnpm nor npm is available"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Setup the development environment"
    echo "  dev       - Start development server"
    echo "  build     - Build for production"
    echo "  test      - Run tests"
    echo "  models    - Install AI models"
    echo "  check     - Check system requirements"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup     # Setup environment and install dependencies"
    echo "  $0 dev       # Start development server"
    echo "  $0 build     # Build for production"
}

# Main script logic
main() {
    print_header
    
    case "${1:-dev}" in
        "setup")
            print_status "Setting up SuperClaude Commercial..."
            check_node_version || exit 1
            check_ollama || exit 1
            setup_environment
            install_dependencies
            install_ai_models
            print_success "Setup completed successfully!"
            print_status "You can now run '$0 dev' to start the development server"
            ;;
        "dev")
            print_status "Starting development server..."
            check_node_version || exit 1
            check_ollama || exit 1
            install_dependencies
            start_development
            ;;
        "build")
            print_status "Building for production..."
            check_node_version || exit 1
            install_dependencies
            build_production
            ;;
        "test")
            print_status "Running tests..."
            check_node_version || exit 1
            install_dependencies
            run_tests
            ;;
        "models")
            print_status "Installing AI models..."
            check_ollama || exit 1
            install_ai_models
            ;;
        "check")
            print_status "Checking system requirements..."
            check_node_version
            check_ollama
            print_success "System check completed"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 