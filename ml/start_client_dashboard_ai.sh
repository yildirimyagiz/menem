#!/bin/bash

# Client Dashboard AI Service Startup Script
# This script starts the AI-powered client dashboard service

echo "🚀 Starting Client Dashboard AI Service..."

# Set environment variables
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export CLIENT_DASHBOARD_AI_PORT=8001
export CLIENT_DASHBOARD_AI_HOST=0.0.0.0

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if Redis is running (for caching)
echo "🔍 Checking Redis status..."
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️  Redis not running. Starting Redis..."
    brew services start redis 2>/dev/null || echo "Please install Redis manually"
fi

# Start the AI service
echo "🎯 Starting Client Dashboard AI API..."
python api/client_dashboard_api.py &

# Get the PID
AI_PID=$!
echo "✅ Client Dashboard AI Service started with PID: $AI_PID"

# Save PID to file
echo $AI_PID > client_dashboard_ai.pid

# Wait for service to start
sleep 3

# Check if service is running
if curl -s http://localhost:8001/health > /dev/null; then
    echo "✅ Client Dashboard AI Service is running on http://localhost:8001"
    echo "📊 API Documentation: http://localhost:8001/docs"
    echo "🔍 Health Check: http://localhost:8001/health"
else
    echo "❌ Failed to start Client Dashboard AI Service"
    exit 1
fi

echo ""
echo "🎉 Client Dashboard AI Service is ready!"
echo "📋 Available endpoints:"
echo "   - GET  /health                    - Health check"
echo "   - POST /metrics                   - Get dashboard metrics"
echo "   - POST /insights                  - Get AI insights"
echo "   - POST /activities                - Get smart activities"
echo "   - POST /recommendations           - Get AI recommendations"
echo "   - POST /predictive-analytics      - Get predictive analytics"
echo "   - POST /dashboard-summary         - Get complete dashboard data"
echo "   - POST /cache/clear               - Clear cache"
echo "   - GET  /cache/status              - Get cache status"
echo ""
echo "🛑 To stop the service: kill $AI_PID"
echo "📝 Logs will be displayed below:"
echo ""

# Wait for the process
wait $AI_PID 