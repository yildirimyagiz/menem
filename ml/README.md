# 🤖 ML Services - Reservatior Property Management

Comprehensive AI/ML tools for property analysis, visualization, and insights.

## 🚀 Quick Start

### Main Dashboard

```bash
python3 -m streamlit run ml_dashboard_main.py --server.port 8500
```

**Access:** http://localhost:8500

### Individual Services

#### 1. Property Map Visualizer

```bash
python3 -m streamlit run property_map_visualizer.py --server.port 8502
```

**Access:** http://localhost:8502

#### 2. Places Analyzer (AI Analysis)

```bash
python3 -m streamlit run places_analyzer.py --server.port 8503
```

**Access:** http://localhost:8503

#### 3. ML API Backend

```bash
python3 places_api.py
```

**Access:** http://localhost:8001/docs

#### 4. Demo Dashboard

```bash
python3 -m streamlit run demo_dashboard.py --server.port 8501
```

**Access:** http://localhost:8501

## 📊 Services Overview

### 🗺️ Property Map Visualizer

Interactive map with comprehensive property analytics:

**Features:**

- **Interactive Folium Map**: Color-coded property markers
- **Advanced Filtering**: By listing type, price, location, ML score
- **Real-time Analytics**: Price distribution, trends, statistics
- **Market Insights**: Geographic distribution, property types
- **Export Capabilities**: CSV download of filtered data

**Map Features:**

- 🔴 **Red Markers**: For Sale properties
- 🔵 **Blue Markers**: For Rent properties
- 🟢 **Green Markers**: Booking properties
- **Detailed Popups**: Complete property information
- **Tooltips**: Quick price and title preview

### 🔍 Places Analyzer (AI-Powered)

Advanced property analysis with machine learning:

**Features:**

- **Photo Upload**: Drag & drop property images
- **AI Analysis**: Property type detection and classification
- **Price Estimation**: ML-driven market value assessment
- **Feature Detection**: Rooms, amenities, property characteristics
- **Confidence Scoring**: AI reliability metrics
- **Batch Processing**: Multiple photo analysis

**Analysis Results:**

- Property type classification
- Estimated market value
- Detected rooms and amenities
- Interior/exterior quality scores
- Location-based insights
- ML confidence levels

### ⚡ ML API Backend

FastAPI-powered backend for ML services:

**Endpoints:**

- `GET /api/places/health` - Service health check
- `POST /api/places/analyze` - Single photo analysis
- `POST /api/places/batch-analyze` - Batch photo analysis
- `GET /api/places/sample-data` - Sample property data

**Features:**

- RESTful API design
- Image processing and analysis
- Error handling and validation
- Health monitoring
- Sample data generation

### 📊 Demo Dashboard

Analytics and insights dashboard:

**Features:**

- Portfolio distribution visualization
- Occupancy trends analysis
- Location distribution charts
- AI insights and recommendations
- Performance metrics

## 🛠️ Installation & Setup

### Prerequisites

```bash
# Python 3.8+
python3 --version

# Install dependencies
python3 -m pip install -r requirements.txt
```

### Dependencies

```
streamlit>=1.35.0
fastapi>=0.68.0
uvicorn>=0.15.0
folium>=0.12.0
streamlit-folium>=0.25.0
plotly>=5.0.0
pandas>=1.4.0
numpy>=1.21.0
pillow>=8.3.0
torch>=1.9.0
torchvision>=0.10.0
python-multipart>=0.0.5
```

### Quick Installation

```bash
# Install all required packages
python3 -m pip install streamlit fastapi uvicorn folium streamlit-folium plotly pandas numpy pillow torch torchvision python-multipart
```

## 📁 File Structure

```
ml/
├── ml_dashboard_main.py          # Main dashboard hub
├── property_map_visualizer.py    # Interactive property map
├── places_analyzer.py           # AI property analysis
├── places_api.py                # FastAPI backend
├── demo_dashboard.py            # Analytics dashboard
├── app.py                       # Original ML app
├── analyze_api.py               # Analysis API
├── clip_recognition.py          # Image recognition
├── imagenet_classes.txt         # ImageNet labels
├── requirements.txt             # Dependencies
├── i18n.py                     # Internationalization
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

```bash
# ML API URL (for frontend integration)
NEXT_PUBLIC_ML_API_URL=http://localhost:8001

# Streamlit configuration
STREAMLIT_SERVER_PORT=8500
STREAMLIT_SERVER_ADDRESS=localhost
```

### Port Configuration

- **Main Dashboard**: 8500
- **Property Map**: 8502
- **Places Analyzer**: 8503
- **Demo Dashboard**: 8501
- **ML API Backend**: 8001

## 🎯 Usage Examples

### 1. Property Analysis

```python
# Upload property photo and get AI analysis
import requests

url = "http://localhost:8001/api/places/analyze"
files = {"photo": open("property_photo.jpg", "rb")}
response = requests.post(url, files=files)
analysis = response.json()
```

### 2. Batch Analysis

```python
# Analyze multiple property photos
url = "http://localhost:8001/api/places/batch-analyze"
files = [("photos", open(f"photo_{i}.jpg", "rb")) for i in range(5)]
response = requests.post(url, files=files)
batch_results = response.json()
```

### 3. Health Check

```python
# Check ML service status
import requests

url = "http://localhost:8001/api/places/health"
response = requests.get(url)
status = response.json()
```

## 📈 Features & Capabilities

### 🗺️ Map Visualization

- **Interactive Mapping**: Folium-based interactive maps
- **Property Markers**: Color-coded by listing type
- **Filtering System**: Multi-criteria property filtering
- **Analytics Integration**: Real-time statistics and trends
- **Export Functionality**: CSV data export

### 🔍 AI Analysis

- **Image Recognition**: Property type and feature detection
- **Price Estimation**: ML-driven market value assessment
- **Quality Scoring**: Interior/exterior quality analysis
- **Amenity Detection**: Automatic feature identification
- **Confidence Metrics**: AI reliability scoring

### 📊 Analytics

- **Price Distribution**: Histograms and trends
- **Geographic Analysis**: Location-based insights
- **Market Trends**: Time-series analysis
- **Performance Metrics**: Key statistics and KPIs
- **Visualization**: Charts, graphs, and dashboards

### ⚡ API Integration

- **RESTful Design**: Standard HTTP endpoints
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation and sanitization
- **Documentation**: Auto-generated API docs
- **Health Monitoring**: Service status tracking

## 🔗 Integration with Frontend

### React/Next.js Integration

```typescript
// ML Service integration
import { mlApi } from "~/services/mlService";

// Analyze property photo
const analyzeProperty = async (file: File) => {
  const result = await mlApi.analyzePropertyPhoto(file);
  return result;
};

// Get health status
const checkHealth = async () => {
  const status = await mlApi.healthCheck();
  return status;
};
```

### Frontend Components

- **PropertyAnalysisCard**: Display ML analysis results
- **MLAnalysisUploader**: Photo upload and analysis
- **MLDashboard**: Comprehensive ML dashboard
- **InsightsTab**: Analytics and insights

## 🚀 Deployment

### Local Development

```bash
# Start all services
python3 -m streamlit run ml_dashboard_main.py --server.port 8500 &
python3 -m streamlit run property_map_visualizer.py --server.port 8502 &
python3 -m streamlit run places_analyzer.py --server.port 8503 &
python3 places_api.py &
```

### Production Deployment

```bash
# Using systemd (Linux)
sudo systemctl enable ml-services
sudo systemctl start ml-services

# Using Docker
docker-compose up -d
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check running processes
lsof -i :8500
lsof -i :8502
lsof -i :8503
lsof -i :8001

# Kill process if needed
kill -9 <PID>
```

#### 2. Streamlit Not Found

```bash
# Install streamlit
python3 -m pip install streamlit

# Or use full path
python3 -m streamlit run app.py
```

#### 3. ML Model Loading Issues

```bash
# Check model files
ls -la imagenet_classes.txt

# Reinstall dependencies
python3 -m pip install --upgrade torch torchvision
```

### Health Checks

```bash
# Check ML API
curl http://localhost:8001/api/places/health

# Check Streamlit apps
curl http://localhost:8500
curl http://localhost:8502
curl http://localhost:8503
```

## 📚 API Documentation

### Endpoints

#### Health Check

```http
GET /api/places/health
```

**Response:**

```json
{
  "status": "healthy",
  "model_loaded": true,
  "labels_loaded": true
}
```

#### Single Photo Analysis

```http
POST /api/places/analyze
Content-Type: multipart/form-data
```

**Request:** Photo file upload
**Response:**

```json
{
  "success": true,
  "filename": "property_photo.jpg",
  "analysis": {
    "property_type": "apartment",
    "estimated_price": 450000,
    "confidence_level": 0.85,
    "detected_rooms": ["bedroom", "kitchen", "living_room"],
    "detected_amenities": ["air_conditioning", "parking"]
  }
}
```

#### Batch Analysis

```http
POST /api/places/batch-analyze
Content-Type: multipart/form-data
```

**Request:** Multiple photo files
**Response:**

```json
{
  "success": true,
  "results": [...],
  "total_processed": 5
}
```

## 🤝 Contributing

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd ml

# Install dependencies
python3 -m pip install -r requirements.txt

# Run tests
python3 -m pytest tests/

# Start development
python3 -m streamlit run ml_dashboard_main.py
```

### Code Style

- Follow PEP 8 for Python code
- Use type hints where applicable
- Add docstrings to functions
- Include error handling

## 📄 License

This project is part of the Reservatior Property Management System.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review API documentation
3. Check service health endpoints
4. Contact the development team

---

**🤖 ML Services - Powered by AI/ML technologies for intelligent property management**
