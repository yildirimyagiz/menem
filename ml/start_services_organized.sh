#!/bin/bash

# ML Services Startup Script - Organized Version
# This script starts all ML services for the Reservatior platform

echo "🤖 Starting ML Services for Reservatior (Organized)..."

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Function to start service
start_service() {
    local service_name=$1
    local command=$2
    local port=$3
    
    echo "🚀 Starting $service_name on port $port..."
    
    if check_port $port; then
        eval "$command" &
        local pid=$!
        echo "✅ $service_name started with PID: $pid"
        return $pid
    else
        echo "❌ Failed to start $service_name - port $port is busy"
        return 1
    fi
}

# Kill existing processes on our ports
echo "🧹 Cleaning up existing processes..."
pkill -f "streamlit.*8500" 2>/dev/null
pkill -f "streamlit.*8501" 2>/dev/null
pkill -f "streamlit.*8502" 2>/dev/null
pkill -f "streamlit.*8503" 2>/dev/null
pkill -f "streamlit.*8504" 2>/dev/null
pkill -f "streamlit.*8505" 2>/dev/null
pkill -f "streamlit.*8506" 2>/dev/null
pkill -f "streamlit.*8507" 2>/dev/null
pkill -f "streamlit.*8508" 2>/dev/null
pkill -f "python.*places_api.py" 2>/dev/null

# Wait a moment for cleanup
sleep 2

# Start services from organized locations
echo ""
echo "📡 Starting ML Services from organized locations..."

# 1. Main Dashboard
start_service "Main Dashboard" "python3 -m streamlit run dashboards/ml_dashboard_main.py --server.port 8500 --server.headless true" 8500
MAIN_DASHBOARD_PID=$!

# 2. Property Map Visualizer
start_service "Property Map Visualizer" "python3 -m streamlit run services/property_map_visualizer.py --server.port 8502 --server.headless true" 8502
MAP_VISUALIZER_PID=$!

# 3. Places Analyzer
start_service "Places Analyzer" "python3 -m streamlit run services/places_analyzer.py --server.port 8503 --server.headless true" 8503
PLACES_ANALYZER_PID=$!

# 4. Enhanced Property Analyzer
start_service "Enhanced Property Analyzer" "python3 -m streamlit run services/enhanced_property_analyzer.py --server.port 8504 --server.headless true" 8504
ENHANCED_ANALYZER_PID=$!

# 5. Advanced Property Analytics
start_service "Advanced Property Analytics" "python3 -m streamlit run services/advanced_property_analytics.py --server.port 8505 --server.headless true" 8505
ADVANCED_ANALYTICS_PID=$!

# 6. Enhanced Property Management
start_service "Enhanced Property Management" "python3 -m streamlit run services/enhanced_property_management.py --server.port 8506 --server.headless true" 8506
ENHANCED_MANAGEMENT_PID=$!

# 7. Report Analytics Dashboard (NEW!)
start_service "Report Analytics Dashboard" "python3 -m streamlit run report_analytics_dashboard.py --server.port 8507 --server.headless true" 8507
REPORT_ANALYTICS_PID=$!

# 8. Report Generation Service (NEW!)
start_service "Report Generation Service" "python3 -m streamlit run report_generation_service.py --server.port 8508 --server.headless true" 8508
REPORT_GENERATION_PID=$!

# 9. Demo Dashboard
start_service "Demo Dashboard" "python3 -m streamlit run dashboards/demo_dashboard.py --server.port 8501 --server.headless true" 8501
DEMO_DASHBOARD_PID=$!

# 10. ML API Backend
start_service "ML API Backend" "python3 api/places_api.py" 8001
API_BACKEND_PID=$!

# Wait for services to start
echo ""
echo "⏳ Waiting for services to start..."
sleep 5

# Check service status
echo ""
echo "📊 Service Status:"

check_service_status() {
    local service_name=$1
    local port=$2
    local pid=$3
    
    if curl -s http://localhost:$port >/dev/null 2>&1; then
        echo "✅ $service_name (Port $port) - RUNNING"
    else
        echo "❌ $service_name (Port $port) - FAILED"
    fi
}

check_service_status "Main Dashboard" 8500 $MAIN_DASHBOARD_PID
check_service_status "Property Map Visualizer" 8502 $MAP_VISUALIZER_PID
check_service_status "Places Analyzer" 8503 $PLACES_ANALYZER_PID
check_service_status "Enhanced Property Analyzer" 8504 $ENHANCED_ANALYZER_PID
check_service_status "Advanced Property Analytics" 8505 $ADVANCED_ANALYTICS_PID
check_service_status "Enhanced Property Management" 8506 $ENHANCED_MANAGEMENT_PID
check_service_status "Report Analytics Dashboard" 8507 $REPORT_ANALYTICS_PID
check_service_status "Report Generation Service" 8508 $REPORT_GENERATION_PID
check_service_status "Demo Dashboard" 8501 $DEMO_DASHBOARD_PID

# Check API backend
if curl -s http://localhost:8001/api/places/health >/dev/null 2>&1; then
    echo "✅ ML API Backend (Port 8001) - RUNNING"
else
    echo "❌ ML API Backend (Port 8001) - FAILED"
fi

echo ""
echo "🌐 Service URLs:"
echo "   Main Dashboard:                 http://localhost:8500"
echo "   Property Map:                   http://localhost:8502"
echo "   Places Analyzer:                http://localhost:8503"
echo "   Enhanced Property Analyzer:     http://localhost:8504"
echo "   Advanced Property Analytics:    http://localhost:8505"
echo "   Enhanced Property Management:   http://localhost:8506"
echo "   Report Analytics Dashboard:     http://localhost:8507"
echo "   Report Generation Service:      http://localhost:8508"
echo "   Demo Dashboard:                 http://localhost:8501"
echo "   API Documentation:              http://localhost:8001/docs"
echo "   API Health Check:               http://localhost:8001/api/places/health"

echo ""
echo "📋 Process IDs (for stopping services):"
echo "   Main Dashboard:                 $MAIN_DASHBOARD_PID"
echo "   Property Map:                   $MAP_VISUALIZER_PID"
echo "   Places Analyzer:                $PLACES_ANALYZER_PID"
echo "   Enhanced Property Analyzer:     $ENHANCED_ANALYZER_PID"
echo "   Advanced Property Analytics:    $ADVANCED_ANALYTICS_PID"
echo "   Enhanced Property Management:   $ENHANCED_MANAGEMENT_PID"
echo "   Report Analytics Dashboard:     $REPORT_ANALYTICS_PID"
echo "   Report Generation Service:      $REPORT_GENERATION_PID"
echo "   Demo Dashboard:                 $DEMO_DASHBOARD_PID"
echo "   API Backend:                    $API_BACKEND_PID"

echo ""
echo "📁 Organized File Structure:"
echo "   📂 services/ - Streamlit service applications"
echo "   📂 dashboards/ - Dashboard applications"
echo "   📂 api/ - API backend services"
echo "   📂 utils/ - Utility functions and helpers"
echo "   📂 analytics/ - Analytics tools (future)"
echo "   📂 management/ - Management tools (future)"

echo ""
echo "💡 To stop all services, run:"
echo "   pkill -f 'streamlit.*850' && pkill -f 'python.*places_api.py'"

echo ""
echo "🎉 ML Services are ready!"
echo "   Open http://localhost:8500 to access the main dashboard"
echo ""
echo "🚀 Enhanced Features Available:"
echo "   • Image Comparison: Side-by-side property analysis"
echo "   • Property Labeling: Interactive feature annotation"
echo "   • Live Camera Input: Real-time property capture"
echo "   • AI Chat Assistant: Intelligent property analysis"
echo "   • Comprehensive Analysis: Advanced analytics and insights"
echo ""
echo "📊 Advanced Analytics Features:"
echo "   • Data Profiling: Comprehensive pandas profiling reports"
echo "   • Advanced Search: Smart search with filters and suggestions"
echo "   • Interactive Analytics: Pills, click detection, and interactive charts"
echo "   • Market Insights: Detailed market performance analysis"
echo "   • Property Cards: Beautiful card-based property display"
echo "   • Click Analytics: User interaction tracking and analytics"
echo ""
echo "🏢 Property Management Features:"
echo "   • Dashboard Overview: Comprehensive property management dashboard"
echo "   • Tenant Management: Tenant information, payments, and ratings"
echo "   • Financial Analysis: Revenue, expenses, and profit analysis"
echo "   • Maintenance Tracking: Maintenance scheduling and cost tracking"
echo "   • Feedback System: Trubrics feedback collection and analytics"
echo "   • AI Assistant: Chat-based property management assistance"
echo ""
echo "📊 Report Analytics Features:"
echo "   • Dashboard Overview: Comprehensive report analytics dashboard"
echo "   • Financial Analytics: Revenue, expenses, and profit analysis"
echo "   • Occupancy Analytics: Occupancy trends and patterns"
echo "   • Performance Analytics: KPI tracking and performance metrics"
echo "   • Report Generation: ML-powered report creation"
echo "   • Scheduled Reports: Automated report scheduling"
echo "   • AI Assistant: Chat-based report analytics assistance"
echo ""
echo "🔄 Report Generation Features:"
echo "   • ML-Powered Generation: AI-enhanced report creation"
echo "   • Custom Report Builder: Flexible report configuration"
echo "   • Batch Generation: Bulk report processing"
echo "   • Scheduled Reports: Automated report scheduling"
echo "   • Report Templates: Pre-built report templates"
echo "   • AI Assistant: Intelligent report generation assistance" 