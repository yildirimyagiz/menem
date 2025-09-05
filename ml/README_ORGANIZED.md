# 🏢 Reservatior ML Services - Organized Structure

## 📁 File Organization

```
ml/
├── 📂 services/                    # Streamlit service applications
│   ├── property_map_visualizer.py  # Interactive property map with analytics
│   ├── places_analyzer.py         # AI-powered property analysis
│   ├── enhanced_property_analyzer.py # Advanced analysis with image comparison, labeling, camera, chat
│   ├── advanced_property_analytics.py # Advanced analytics with profiling, search, click detection
│   └── enhanced_property_management.py # Property management with feedback, chat, tables
│
├── 📂 dashboards/                  # Dashboard applications
│   ├── ml_dashboard_main.py       # Main dashboard hub
│   └── demo_dashboard.py          # Analytics dashboard
│
├── 📂 api/                         # API backend services
│   ├── places_api.py              # FastAPI backend for ML services
│   └── app.py                     # Alternative API implementation
│
├── 📂 utils/                       # Utility functions and helpers
│   ├── analyze_api.py             # API analysis utilities
│   ├── clip_recognition.py        # CLIP model utilities
│   └── i18n.py                    # Internationalization utilities
│
├── 📂 analytics/                   # Analytics tools (future)
├── 📂 management/                  # Management tools (future)
│
├── 📄 requirements.txt             # Python dependencies
├── 📄 start_services_organized.sh  # Organized startup script
├── 📄 start_all_services.sh       # Original startup script
├── 📄 README.md                   # Original documentation
├── 📄 README_ORGANIZED.md         # This organized documentation
├── 📄 run_streamlit.py            # Streamlit runner utility
└── 📄 imagenet_classes.txt        # ImageNet class definitions
```

## 🚀 Service Portfolio

| Service                          | Port | URL                        | Status       | Description                                                     |
| -------------------------------- | ---- | -------------------------- | ------------ | --------------------------------------------------------------- |
| **Main Dashboard**               | 8500 | http://localhost:8500      | ✅ Running   | Central hub for all ML services                                 |
| **Property Map**                 | 8502 | http://localhost:8502      | ✅ Running   | Interactive property map with analytics                         |
| **Places Analyzer**              | 8503 | http://localhost:8503      | ✅ Running   | AI-powered property analysis                                    |
| **Enhanced Property Analyzer**   | 8504 | http://localhost:8504      | ✅ Running   | Advanced analysis with image comparison, labeling, camera, chat |
| **Advanced Property Analytics**  | 8505 | http://localhost:8505      | ✅ Running   | Advanced analytics with profiling, search, click detection      |
| **Enhanced Property Management** | 8506 | http://localhost:8506      | ✅ Running   | Property management with feedback, chat, tables                 |
| **Demo Dashboard**               | 8501 | http://localhost:8501      | ✅ Running   | Analytics dashboard                                             |
| **ML API Backend**               | 8001 | http://localhost:8001/docs | ⚠️ Needs Fix | FastAPI backend for ML services                                 |

## 🎯 Enhanced Features

### 🚀 Enhanced Property Analyzer (Port 8504)

- **🖼️ Image Comparison**: Side-by-side property analysis with slider controls
- **🏷️ Property Labeling**: Interactive feature annotation with polygon drawing
- **📷 Live Camera Input**: Real-time property photo capture and analysis
- **🤖 AI Chat Assistant**: Intelligent property analysis with natural language
- **📊 Comprehensive Analysis**: Advanced analytics and market insights

### 📊 Advanced Property Analytics (Port 8505)

- **📈 Data Profiling**: Comprehensive pandas profiling reports
- **🔍 Advanced Search**: Smart search with filters and suggestions
- **🎯 Interactive Analytics**: Pills, click detection, and interactive charts
- **📊 Market Insights**: Detailed market performance analysis
- **🏠 Property Cards**: Beautiful card-based property display
- **🖱️ Click Analytics**: User interaction tracking and analytics

### 🏢 Enhanced Property Management (Port 8506)

- **📊 Dashboard Overview**: Comprehensive property management dashboard
- **👥 Tenant Management**: Tenant information, payments, and ratings
- **💰 Financial Analysis**: Revenue, expenses, and profit analysis
- **🔧 Maintenance Tracking**: Maintenance scheduling and cost tracking
- **📝 Feedback System**: Trubrics feedback collection and analytics
- **🤖 AI Assistant**: Chat-based property management assistance

## 🔧 Quick Start

### Start All Services

```bash
cd /Users/yildirimy/Downloads/Reservatior/ml
./start_services_organized.sh
```

### Start Individual Services

```bash
# Main Dashboard
python3 -m streamlit run dashboards/ml_dashboard_main.py --server.port 8500

# Property Map
python3 -m streamlit run services/property_map_visualizer.py --server.port 8502

# Places Analyzer
python3 -m streamlit run services/places_analyzer.py --server.port 8503

# Enhanced Property Analyzer
python3 -m streamlit run services/enhanced_property_analyzer.py --server.port 8504

# Advanced Property Analytics
python3 -m streamlit run services/advanced_property_analytics.py --server.port 8505

# Enhanced Property Management
python3 -m streamlit run services/enhanced_property_management.py --server.port 8506

# Demo Dashboard
python3 -m streamlit run dashboards/demo_dashboard.py --server.port 8501

# API Backend
python3 api/places_api.py
```

### Stop All Services

```bash
pkill -f 'streamlit.*850' && pkill -f 'python.*places_api.py'
```

## 📦 Installed Packages

### Core Dependencies

- `streamlit>=1.35.0` - Web application framework
- `fastapi>=0.68.0` - API framework
- `uvicorn>=0.15.0` - ASGI server
- `folium>=0.12.0` - Interactive maps
- `plotly>=5.0.0` - Interactive charts
- `pandas>=1.4.0` - Data manipulation
- `numpy>=1.21.0` - Numerical computing
- `pillow>=8.3.0` - Image processing
- `torch>=1.9.0` - Machine learning
- `torchvision>=0.10.0` - Computer vision

### Enhanced Streamlit Packages

- `streamlit-image-comparison>=0.0.4` - Image comparison
- `streamlit-sparrow-labeling>=0.1.1` - Property labeling
- `streamlit-camera-input-live>=0.2.0` - Live camera input
- `streamlit-chatbox>=1.1.13` - Chat interface
- `streamlit-nested-layout>=0.1.4` - Nested layouts
- `streamlit-markdown>=1.1.0` - Markdown support
- `streamlit-javascript>=0.1.5` - JavaScript integration
- `streamlit-feedback>=0.1.4` - Feedback collection

### Advanced Analytics Packages

- `streamlit-pandas-profiling>=0.1.3` - Data profiling
- `streamlit-searchbox>=0.1.22` - Advanced search
- `st-click-detector>=0.1.3` - Click detection
- `streamlit-pills>=0.3.0` - Interactive pills
- `streamlit-scrollable-textbox>=0.0.3` - Scrollable text
- `st-card-component>=0.0.10` - Card components
- `pandas-profiling>=3.6.6` - Data profiling
- `ydata-profiling>=4.16.1` - Enhanced profiling

### Property Management Packages

- `trubrics>=1.6.2` - Feedback collection and analytics
- `st-chat-message>=0.3.8` - Chat message components
- `streamlit-awesome-table>=0.1.0` - Interactive tables
- `loguru>=0.7.3` - Advanced logging
- `typer>=0.16.0` - CLI utilities
- `rich>=14.0.0` - Rich text formatting
- `markdown-it-py>=3.0.0` - Markdown processing
- `pygments>=2.19.2` - Syntax highlighting
- `mdurl>=0.1.2` - URL processing
- `shellingham>=1.5.4` - Shell detection

## 🎯 Usage Instructions

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

## 🔧 Troubleshooting

### Services Not Starting

1. Check if ports are already in use:
   ```bash
   lsof -i :8500-8506
   ```
2. Kill existing processes:
   ```bash
   pkill -f 'streamlit.*850'
   ```
3. Restart services:
   ```bash
   ./start_services_organized.sh
   ```

### Missing Dependencies

1. Install all dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Install specific packages:
   ```bash
   pip install trubrics st-chat-message streamlit-awesome-table
   ```

### API Backend Issues

1. Check if API is running:
   ```bash
   curl http://localhost:8001/api/places/health
   ```
2. Start API manually:
   ```bash
   python3 api/places_api.py
   ```

## 📊 Performance Tips

1. **Install Watchdog** for better performance:

   ```bash
   xcode-select --install
   pip install watchdog
   ```

2. **Use Headless Mode** for production:

   ```bash
   streamlit run app.py --server.headless true
   ```

3. **Monitor Resources**:
   ```bash
   top -p $(pgrep -f streamlit)
   ```

## 🎉 Success Metrics

- ✅ All 7 Streamlit services running successfully
- ✅ Enhanced features with image comparison, labeling, camera input
- ✅ Advanced analytics with profiling, search, click detection
- ✅ Property management with feedback, chat, tables
- ✅ Organized file structure for better maintainability
- ✅ Comprehensive documentation and usage instructions

## 🚀 Next Steps

1. **Fix API Backend**: Resolve the FastAPI backend issue
2. **Add Authentication**: Implement user authentication
3. **Database Integration**: Connect to real property database
4. **Mobile Optimization**: Optimize for mobile devices
5. **Performance Monitoring**: Add monitoring and analytics
6. **Deployment**: Deploy to production environment

---

**🎯 All services are now organized and running successfully!**

Access the main dashboard at: http://localhost:8500
