import streamlit as st
import subprocess
import sys
import os
from pathlib import Path
import socket

# Set page config
st.set_page_config(
    page_title="ML Dashboard - Reservatior",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: 2rem;
    }
    .tool-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        border-radius: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .status-indicator {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .status-online { background-color: #4CAF50; }
    .status-offline { background-color: #f44336; }
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .enhanced-feature {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .advanced-feature {
        background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .management-feature {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .report-feature {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        color: #333;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .generation-feature {
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        color: #333;
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

def check_service_status(port):
    """Check if a service is running on a specific port"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        return result == 0
    except:
        return False

def is_port_open(host: str, port: int, timeout: float = 1.0) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False

# Health check for backend services
report_analytics_online = is_port_open("localhost", 2998)
report_generation_online = is_port_open("localhost", 2998)  # Use a different port if needed

# --- ML Services Section ---
services = [
    {
        "category": "Map & Analytics",
        "name": "Property Map Visualizer",
        "icon": "🗺️",
        "desc": "Interactive property map with analytics",
        "url": "http://localhost:8502",
        "status": "online"
    },
    {
        "category": "Map & Analytics",
        "name": "Places Analyzer",
        "icon": "🔍",
        "desc": "AI-powered property analysis",
        "url": "http://localhost:8503",
        "status": "online"
    },
    {
        "category": "Map & Analytics",
        "name": "Enhanced Property Analyzer",
        "icon": "🚀",
        "desc": "Advanced analysis with image comparison, labeling, camera input, and chat",
        "url": "http://localhost:8504",
        "status": "online"
    },
    {
        "category": "Map & Analytics",
        "name": "Advanced Property Analytics",
        "icon": "📊",
        "desc": "Advanced analytics with profiling, search, click detection, pills, and cards",
        "url": "http://localhost:8505",
        "status": "online"
    },
    {
        "category": "Management",
        "name": "Enhanced Property Management",
        "icon": "🏢",
        "desc": "Property management with feedback, chat messages, and awesome tables",
        "url": "http://localhost:8506",
        "status": "online"
    },
    {
        "name": "Report Analytics Dashboard",
        "desc": "Comprehensive report analytics with ML insights",
        "icon": "📊",
        "category": "Backend/API",
        "status": "online" if report_analytics_online else "offline",
        "url": "http://localhost:8507"
    },
    {
        "name": "Report Generation Service",
        "desc": "ML-powered report generation with AI assistance",
        "icon": "📄",
        "category": "Backend/API",
        "status": "online" if report_generation_online else "offline",
        "url": "http://localhost:8508"
    },
    {
        "category": "Backend/API",
        "name": "ML API Backend",
        "icon": "⚡",
        "desc": "FastAPI backend for ML services",
        "url": "http://localhost:8001/docs",
        "status": "offline"
    }
]

# Business-driven tabs based on Prisma models
business_tabs = [
    "Properties & Analytics",
    "People",
    "Transactions",
    "Tasks & Operations",
    "Communication & Feedback",
    "System/Backend"
]
tabs = st.tabs(business_tabs)

# Helper: group services by new business tab
business_tab_map = {
    "Properties & Analytics": [
        "Property Map Visualizer",
        "Places Analyzer",
        "Enhanced Property Analyzer",
        "Advanced Property Analytics"
    ],
    "People": [
        "Enhanced Property Management"
    ],
    "Transactions": [
        # Add future services for Reservation, Payment, Subscription, Expense
    ],
    "Tasks & Operations": [
        # Add future tools for Task, Ticket, Compliance, Report
        "Report Analytics Dashboard",
        "Report Generation Service"
    ],
    "Communication & Feedback": [
        # Add future tools for Notification, Review, Channel, Message
    ],
    "System/Backend": [
        "ML API Backend"
    ]
}

for i, tab in enumerate(business_tabs):
    with tabs[i]:
        st.header(tab)
        tab_services = [s for s in services if s["name"] in business_tab_map[tab]]
        if not tab_services:
            st.info("No tools available for this section yet.")
        for s in tab_services:
            col1, col2, col3, col4 = st.columns([1, 3, 2, 2])
            with col1:
                st.markdown(f"{s['icon']}")
            with col2:
                st.markdown(f"**{s['name']}**  \n{s['desc']}")
            with col3:
                status_emoji = "🟢 Online" if s["status"] == "online" else "🔴 Offline"
                st.markdown(f"**Status:** {status_emoji}")
            with col4:
                if s["status"] == "online":
                    st.link_button("Open", s["url"])
                else:
                    st.button("Unavailable", disabled=True, key=f"unavailable_{s['name']}")
            st.markdown("---")

def main():
    st.markdown('<h1 class="main-header">🤖 ML Dashboard - Reservatior</h1>', unsafe_allow_html=True)
    
    # Sidebar navigation
    st.sidebar.header("🚀 ML Services")
    
    # Service status
    st.sidebar.subheader("Service Status")
    
    # Main content
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="metric-card">
            <h3>🗺️ Property Map Visualizer</h3>
            <p>Interactive map with property analytics, filtering, and market insights.</p>
            <ul>
                <li>Interactive Folium map</li>
                <li>Property filtering by type</li>
                <li>Price and ML score analytics</li>
                <li>Market trends visualization</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("🚀 Launch Map Visualizer", key="map_btn"):
            st.success("Map Visualizer is running on http://localhost:8502")
            st.markdown("[Open Map Visualizer](http://localhost:8502)")
    
    with col2:
        st.markdown("""
        <div class="metric-card">
            <h3>🔍 Places Analyzer</h3>
            <p>AI-powered property analysis with photo recognition and insights.</p>
            <ul>
                <li>Photo upload and analysis</li>
                <li>Property type detection</li>
                <li>Price estimation</li>
                <li>ML confidence scoring</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("🚀 Launch Places Analyzer", key="analyzer_btn"):
            st.success("Places Analyzer is running on http://localhost:8503")
            st.markdown("[Open Places Analyzer](http://localhost:8503)")
    
    # Enhanced Property Analyzer
    st.markdown("""
    <div class="enhanced-feature">
        <h3>🚀 Enhanced Property Analyzer (NEW!)</h3>
        <p>Advanced property analysis with cutting-edge features:</p>
        <ul>
            <li>🖼️ <strong>Image Comparison</strong>: Side-by-side property analysis</li>
            <li>🏷️ <strong>Property Labeling</strong>: Interactive feature annotation</li>
            <li>📷 <strong>Live Camera Input</strong>: Real-time property capture</li>
            <li>🤖 <strong>AI Chat Assistant</strong>: Intelligent property analysis</li>
            <li>📊 <strong>Comprehensive Analysis</strong>: Advanced analytics and insights</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)
    
    # Advanced Property Analytics
    st.markdown("""
    <div class="advanced-feature">
        <h3>📊 Advanced Property Analytics (NEW!)</h3>
        <p>Comprehensive analytics with advanced interactive features:</p>
        <ul>
            <li>📈 <strong>Data Profiling</strong>: Comprehensive pandas profiling reports</li>
            <li>🔍 <strong>Advanced Search</strong>: Smart search with filters and suggestions</li>
            <li>🎯 <strong>Interactive Analytics</strong>: Pills, click detection, and interactive charts</li>
            <li>📊 <strong>Market Insights</strong>: Detailed market performance analysis</li>
            <li>🏠 <strong>Property Cards</strong>: Beautiful card-based property display</li>
            <li>🖱️ <strong>Click Analytics</strong>: User interaction tracking and analytics</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)
    
    # Enhanced Property Management
    st.markdown("""
    <div class="management-feature">
        <h3>🏢 Enhanced Property Management (NEW!)</h3>
        <p>Complete property management solution with advanced features:</p>
        <ul>
            <li>📊 <strong>Dashboard Overview</strong>: Comprehensive property management dashboard</li>
            <li>👥 <strong>Tenant Management</strong>: Tenant information, payments, and ratings</li>
            <li>💰 <strong>Financial Analysis</strong>: Revenue, expenses, and profit analysis</li>
            <li>🔧 <strong>Maintenance Tracking</strong>: Maintenance scheduling and cost tracking</li>
            <li>📝 <strong>Feedback System</strong>: Trubrics feedback collection and analytics</li>
            <li>🤖 <strong>AI Assistant</strong>: Chat-based property management assistance</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)
    
    # Report Analytics Dashboard
    st.markdown("""
    <div class="report-feature">
        <h3>📊 Report Analytics Dashboard (NEW!)</h3>
        <p>Comprehensive report analytics with ML-powered insights:</p>
        <ul>
            <li>📈 <strong>Dashboard Overview</strong>: Comprehensive report analytics dashboard</li>
            <li>💰 <strong>Financial Analytics</strong>: Revenue, expenses, and profit analysis</li>
            <li>🏠 <strong>Occupancy Analytics</strong>: Occupancy trends and patterns</li>
            <li>📊 <strong>Performance Analytics</strong>: KPI tracking and performance metrics</li>
            <li>🔄 <strong>Report Generation</strong>: ML-powered report creation</li>
            <li>⏰ <strong>Scheduled Reports</strong>: Automated report scheduling</li>
            <li>🤖 <strong>AI Assistant</strong>: Chat-based report analytics assistance</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)
    
    # Report Generation Service
    st.markdown("""
    <div class="generation-feature">
        <h3>🔄 Report Generation Service (NEW!)</h3>
        <p>ML-powered report generation with advanced AI capabilities:</p>
        <ul>
            <li>🤖 <strong>ML-Powered Generation</strong>: AI-enhanced report creation</li>
            <li>🔧 <strong>Custom Report Builder</strong>: Flexible report configuration</li>
            <li>📦 <strong>Batch Generation</strong>: Bulk report processing</li>
            <li>⏰ <strong>Scheduled Reports</strong>: Automated report scheduling</li>
            <li>📋 <strong>Report Templates</strong>: Pre-built report templates</li>
            <li>🤖 <strong>AI Assistant</strong>: Intelligent report generation assistance</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3, col4, col5, col6, col7, col8 = st.columns(8)
    
    with col1:
        if st.button("🚀 Enhanced Analyzer", key="enhanced_btn"):
            st.success("Enhanced Property Analyzer is running on http://localhost:8504")
            st.markdown("[Open Enhanced Analyzer](http://localhost:8504)")
    
    with col2:
        if st.button("📊 Advanced Analytics", key="advanced_btn"):
            st.success("Advanced Property Analytics is running on http://localhost:8505")
            st.markdown("[Open Advanced Analytics](http://localhost:8505)")
    
    with col3:
        if st.button("🏢 Property Management", key="management_btn"):
            st.success("Enhanced Property Management is running on http://localhost:8506")
            st.markdown("[Open Property Management](http://localhost:8506)")
    
    with col4:
        if st.button("📊 Report Analytics", key="report_analytics_btn"):
            st.success("Report Analytics Dashboard is running on http://localhost:8507")
            st.markdown("[Open Report Analytics](http://localhost:8507)")
    
    with col5:
        if st.button("🔄 Report Generation", key="report_generation_btn"):
            st.success("Report Generation Service is running on http://localhost:8508")
            st.markdown("[Open Report Generation](http://localhost:8508)")
    
    with col6:
        if st.button("🗺️ Map Visualizer", key="map_quick_btn"):
            st.markdown("[Open Map Visualizer](http://localhost:8502)")
    
    with col7:
        if st.button("🔍 Places Analyzer", key="analyzer_quick_btn"):
            st.markdown("[Open Places Analyzer](http://localhost:8503)")
    
    with col8:
        if st.button("⚡ API Backend", key="api_btn"):
            st.success("ML API Backend is running on http://localhost:8001")
            st.markdown("[Open API Docs](http://localhost:8001/docs)")
    
    # Quick access links
    st.markdown("---")
    st.header("🔗 Quick Access Links")
    
    col1, col2, col3, col4, col5, col6, col7, col8, col9 = st.columns(9)
    
    with col1:
        if st.button("🗺️ Map Visualizer", key="quick_map"):
            st.markdown("[Open Map Visualizer](http://localhost:8502)")
    
    with col2:
        if st.button("🔍 Places Analyzer", key="quick_analyzer"):
            st.markdown("[Open Places Analyzer](http://localhost:8503)")
    
    with col3:
        if st.button("🚀 Enhanced Analyzer", key="quick_enhanced"):
            st.markdown("[Open Enhanced Analyzer](http://localhost:8504)")
    
    with col4:
        if st.button("📊 Advanced Analytics", key="quick_advanced"):
            st.markdown("[Open Advanced Analytics](http://localhost:8505)")
    
    with col5:
        if st.button("🏢 Property Management", key="quick_management"):
            st.markdown("[Open Property Management](http://localhost:8506)")
    
    with col6:
        if st.button("📊 Report Analytics", key="quick_report_analytics"):
            st.markdown("[Open Report Analytics](http://localhost:8507)")
    
    with col7:
        if st.button("🔄 Report Generation", key="quick_report_generation"):
            st.markdown("[Open Report Generation](http://localhost:8508)")
    
    with col8:
        if st.button("⚡ API Backend", key="quick_api"):
            st.markdown("[Open API Docs](http://localhost:8001/docs)")
    
    with col9:
        if st.button("📊 Demo Dashboard", key="quick_demo"):
            st.markdown("[Open Demo Dashboard](http://localhost:8501)")
    
    # Enhanced features overview
    st.markdown("---")
    st.header("✨ Enhanced Features Overview")
    
    enhanced_features = {
        "🖼️ Image Comparison": [
            "Side-by-side property analysis",
            "Before vs after comparison",
            "Interactive slider controls",
            "Property type comparison"
        ],
        "🏷️ Property Labeling": [
            "Interactive feature annotation",
            "Polygon drawing tools",
            "Custom label creation",
            "Dataset generation"
        ],
        "📷 Live Camera Input": [
            "Real-time property capture",
            "Instant photo analysis",
            "AI-powered recognition",
            "Quality assessment"
        ],
        "🤖 AI Chat Assistant": [
            "Intelligent property analysis",
            "Natural language queries",
            "Contextual responses",
            "Interactive guidance"
        ],
        "📊 Comprehensive Analysis": [
            "Advanced analytics dashboard",
            "Market trend analysis",
            "Property comparison metrics",
            "ML insights visualization"
        ]
    }
    
    for feature, details in enhanced_features.items():
        st.markdown(f"**{feature}**")
        for detail in details:
            st.markdown(f"• {detail}")
        st.markdown("")
    
    # Advanced analytics features
    st.markdown("---")
    st.header("📊 Advanced Analytics Features")
    
    advanced_features = {
        "📈 Data Profiling": [
            "Comprehensive pandas profiling reports",
            "Statistical analysis and correlations",
            "Data quality assessment",
            "Interactive profiling dashboard"
        ],
        "🔍 Advanced Search": [
            "Smart search with suggestions",
            "Multi-criteria filtering",
            "Real-time search results",
            "Search analytics and insights"
        ],
        "🎯 Interactive Analytics": [
            "Pills for property type selection",
            "Click detection for user interactions",
            "Interactive charts and visualizations",
            "Real-time data filtering"
        ],
        "📊 Market Insights": [
            "Market performance analysis",
            "City and property type metrics",
            "Trend analysis and forecasting",
            "Demand and inventory insights"
        ],
        "🏠 Property Cards": [
            "Beautiful card-based display",
            "Property image placeholders",
            "Detailed property information",
            "Interactive card interactions"
        ],
        "🖱️ Click Analytics": [
            "User interaction tracking",
            "Click behavior analysis",
            "Session metrics and insights",
            "Conversion rate tracking"
        ]
    }
    
    for feature, details in advanced_features.items():
        st.markdown(f"**{feature}**")
        for detail in details:
            st.markdown(f"• {detail}")
        st.markdown("")
    
    # Property management features
    st.markdown("---")
    st.header("🏢 Property Management Features")
    
    management_features = {
        "📊 Dashboard Overview": [
            "Comprehensive property management dashboard",
            "Key performance metrics",
            "Property status distribution",
            "Financial overview"
        ],
        "👥 Tenant Management": [
            "Tenant information tracking",
            "Payment status monitoring",
            "Lease management",
            "Tenant ratings and feedback"
        ],
        "💰 Financial Analysis": [
            "Revenue and expense tracking",
            "Profit margin analysis",
            "Property performance metrics",
            "Financial reporting"
        ],
        "🔧 Maintenance Tracking": [
            "Maintenance scheduling",
            "Cost tracking and analysis",
            "Upcoming maintenance alerts",
            "Maintenance history"
        ],
        "📝 Feedback System": [
            "Trubrics feedback collection",
            "User rating system",
            "Feedback analytics",
            "Improvement tracking"
        ],
        "🤖 AI Assistant": [
            "Chat-based property management",
            "Natural language queries",
            "Automated insights",
            "Quick action buttons"
        ]
    }
    
    for feature, details in management_features.items():
        st.markdown(f"**{feature}**")
        for detail in details:
            st.markdown(f"• {detail}")
        st.markdown("")
    
    # Report analytics features
    st.markdown("---")
    st.header("📊 Report Analytics Features")
    
    report_features = {
        "📈 Dashboard Overview": [
            "Comprehensive report analytics dashboard",
            "Key performance metrics",
            "Report status distribution",
            "Analytics overview"
        ],
        "💰 Financial Analytics": [
            "Revenue and expense analysis",
            "Profit margin tracking",
            "Financial performance metrics",
            "Revenue forecasting"
        ],
        "🏠 Occupancy Analytics": [
            "Occupancy trend analysis",
            "Seasonal pattern detection",
            "Capacity utilization tracking",
            "Occupancy forecasting"
        ],
        "📊 Performance Analytics": [
            "KPI tracking and analysis",
            "Performance metrics dashboard",
            "Goal comparison and tracking",
            "Performance optimization insights"
        ],
        "🔄 Report Generation": [
            "ML-powered report creation",
            "Automated report generation",
            "Custom report templates",
            "Batch report processing"
        ],
        "⏰ Scheduled Reports": [
            "Automated report scheduling",
            "Recurring report generation",
            "Report delivery management",
            "Schedule optimization"
        ],
        "🤖 AI Assistant": [
            "Chat-based report analytics",
            "Natural language queries",
            "Automated insights generation",
            "Report optimization suggestions"
        ]
    }
    
    for feature, details in report_features.items():
        st.markdown(f"**{feature}**")
        for detail in details:
            st.markdown(f"• {detail}")
        st.markdown("")
    
    # Report generation features
    st.markdown("---")
    st.header("🔄 Report Generation Features")
    
    generation_features = {
        "🤖 ML-Powered Generation": [
            "AI-enhanced report creation",
            "Machine learning insights",
            "Predictive analytics",
            "Automated pattern recognition"
        ],
        "🔧 Custom Report Builder": [
            "Flexible report configuration",
            "Custom metric selection",
            "Personalized visualizations",
            "User-defined templates"
        ],
        "📦 Batch Generation": [
            "Bulk report processing",
            "Parallel report generation",
            "Queue management",
            "Progress tracking"
        ],
        "⏰ Scheduled Reports": [
            "Automated report scheduling",
            "Recurring report generation",
            "Delivery management",
            "Schedule optimization"
        ],
        "📋 Report Templates": [
            "Pre-built report templates",
            "Customizable layouts",
            "Brand integration",
            "Template management"
        ],
        "🤖 AI Assistant": [
            "Intelligent report generation",
            "Natural language processing",
            "Automated insights",
            "Report optimization"
        ]
    }
    
    for feature, details in generation_features.items():
        st.markdown(f"**{feature}**")
        for detail in details:
            st.markdown(f"• {detail}")
        st.markdown("")
    
    # Service information
    st.markdown("---")
    st.header("📋 Service Information")
    
    # API Endpoints
    st.subheader("🔌 API Endpoints")
    
    api_endpoints = {
        "Health Check": "GET /api/places/health",
        "Single Analysis": "POST /api/places/analyze",
        "Batch Analysis": "POST /api/places/batch-analyze",
        "Sample Data": "GET /api/places/sample-data"
    }
    
    for endpoint, method in api_endpoints.items():
        st.code(f"{method}", language="bash")
    
    # New packages information
    st.subheader("🆕 Report Analytics Packages")
    
    new_packages = {
        "trubrics": "Advanced feedback collection and analytics",
        "st-chat-message": "Beautiful chat message components",
        "streamlit-awesome-table": "Interactive and feature-rich tables",
        "streamlit-feedback": "User feedback collection system",
        "loguru": "Advanced logging capabilities",
        "typer": "Command-line interface utilities",
        "rich": "Rich text and formatting",
        "markdown-it-py": "Markdown processing",
        "pygments": "Syntax highlighting",
        "mdurl": "URL processing for markdown",
        "shellingham": "Shell detection utilities"
    }
    
    for package, description in new_packages.items():
        st.markdown(f"**{package}**: {description}")
    
    # Usage instructions
    st.subheader("📖 Report Analytics Usage Instructions")
    
    st.markdown("""
    ### 📊 Report Analytics Dashboard
    1. Navigate to http://localhost:8507
    2. Select analytics mode from sidebar:
       - **Dashboard Overview**: Comprehensive report analytics dashboard
       - **Financial Analytics**: Revenue, expenses, and profit analysis
       - **Occupancy Analytics**: Occupancy trends and patterns
       - **Performance Analytics**: KPI tracking and performance metrics
       - **Report Generation**: ML-powered report creation
       - **Scheduled Reports**: Automated report scheduling
       - **AI Assistant**: Chat-based report analytics assistance
    3. Use the interactive tools for report analytics
    4. Generate insights and export reports
    
    ### 🔄 Report Generation Service
    1. Navigate to http://localhost:8508
    2. Select generation mode from sidebar:
       - **ML-Powered Generation**: AI-enhanced report creation
       - **Custom Report Builder**: Flexible report configuration
       - **Batch Generation**: Bulk report processing
       - **Scheduled Reports**: Automated report scheduling
       - **Report Templates**: Pre-built report templates
       - **AI Assistant**: Intelligent report generation assistance
    3. Use the interactive tools for report generation
    4. Create and schedule reports
    
    ### 🏢 Enhanced Property Management
    1. Navigate to http://localhost:8506
    2. Select management mode from sidebar:
       - **Dashboard Overview**: Comprehensive property management dashboard
       - **Tenant Management**: Tenant information, payments, and ratings
       - **Financial Analysis**: Revenue, expenses, and profit analysis
       - **Maintenance Tracking**: Maintenance scheduling and cost tracking
       - **Feedback System**: Trubrics feedback collection and analytics
       - **AI Assistant**: Chat-based property management assistance
    3. Use the interactive tools for property management
    4. Collect feedback and generate reports
    
    ### 📊 Advanced Property Analytics
    1. Navigate to http://localhost:8505
    2. Select analysis mode from sidebar:
       - **Data Profiling**: Comprehensive data analysis and statistics
       - **Advanced Search**: Smart search with filters and suggestions
       - **Interactive Analytics**: Pills, click detection, and interactive charts
       - **Market Insights**: Detailed market performance analysis
       - **Property Cards**: Beautiful card-based property display
       - **Click Analytics**: User interaction tracking and analytics
    3. Use the interactive tools for detailed property analysis
    4. Export results and insights
    
    ### 🚀 Enhanced Property Analyzer
    1. Navigate to http://localhost:8504
    2. Select analysis mode from sidebar:
       - **Image Comparison**: Compare property images side-by-side
       - **Property Labeling**: Annotate property features interactively
       - **Live Camera Analysis**: Capture and analyze property photos in real-time
       - **AI Chat Assistant**: Chat with AI for property insights
       - **Comprehensive Analysis**: Advanced analytics and market insights
    3. Use the interactive tools for detailed property analysis
    4. Export results and insights
    
    ### 🗺️ Property Map Visualizer
    1. Navigate to http://localhost:8502
    2. Use sidebar filters to refine property selection
    3. Explore interactive map with property markers
    4. View analytics and trends in different tabs
    
    ### 🔍 Places Analyzer
    1. Navigate to http://localhost:8503
    2. Upload property photos for analysis
    3. View AI-generated insights and recommendations
    4. Export analysis results
    
    ### ⚡ ML API Backend
    1. Navigate to http://localhost:8001/docs
    2. Explore available endpoints
    3. Test API functionality
    4. Integrate with frontend applications
    """)
    
    # System requirements
    st.subheader("🔧 Complete System Requirements")
    
    requirements = [
        "Python 3.8+",
        "Streamlit 1.35+",
        "FastAPI",
        "Folium",
        "Plotly",
        "Pandas",
        "NumPy",
        "Pillow",
        "PyTorch (for ML models)",
        "streamlit-image-comparison",
        "streamlit-sparrow-labeling", 
        "streamlit-camera-input-live",
        "streamlit-chatbox",
        "streamlit-nested-layout",
        "streamlit-markdown",
        "streamlit-javascript",
        "streamlit-feedback",
        "streamlit-pandas-profiling",
        "streamlit-searchbox",
        "st-click-detector",
        "streamlit-pills",
        "streamlit-scrollable-textbox",
        "st-card-component",
        "pandas-profiling",
        "ydata-profiling",
        "trubrics",
        "st-chat-message",
        "streamlit-awesome-table",
        "loguru",
        "typer",
        "rich",
        "markdown-it-py",
        "pygments",
        "mdurl",
        "shellingham"
    ]
    
    for req in requirements:
        st.markdown(f"• {req}")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666;">
        <p>🤖 ML Dashboard - Reservatior Property Management System</p>
        <p>Powered by Streamlit, FastAPI, and AI/ML technologies</p>
        <p>Enhanced with advanced image comparison, labeling, camera input, chat, profiling, search, analytics, feedback, management, and report generation features</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main() 