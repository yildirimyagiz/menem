import streamlit as st
from PIL import Image
import numpy as np
import io
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import time

st.set_page_config(
    page_title="ML Photo Analyzer", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .analysis-section {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div class="main-header">
    <h1>🤖 ML Photo Analyzer</h1>
    <p>Upload property photos and get real-time ML analysis with advanced visualizations</p>
</div>
""", unsafe_allow_html=True)

import requests
import torch
import torchvision.transforms as T
from torchvision import models
import urllib.request

# Load ImageNet labels
@st.cache_resource
def get_imagenet_labels():
    url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
    labels_path = "imagenet_classes.txt"
    try:
        with open(labels_path, "r") as f:
            labels = [line.strip() for line in f.readlines()]
        # Add debugging info
        print(f"Loaded {len(labels)} ImageNet labels")
        if len(labels) < 1000:
            print(f"Warning: Expected 1000 labels, got {len(labels)}")
    except FileNotFoundError:
        print("Downloading ImageNet labels...")
        urllib.request.urlretrieve(url, labels_path)
        with open(labels_path, "r") as f:
            labels = [line.strip() for line in f.readlines()]
        print(f"Downloaded and loaded {len(labels)} ImageNet labels")
    return labels

# Load ResNet-18 model
@st.cache_resource
def get_resnet_model():
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.eval()
    return model

# Image recognition function
@st.cache_data(show_spinner=False)
def recognize_image(_image: Image.Image):
    try:
        preprocess = T.Compose([
            T.Resize(256),
            T.CenterCrop(224),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        input_tensor = preprocess(_image.convert("RGB")).unsqueeze(0)
        model = get_resnet_model()
        with torch.no_grad():
            output = model(input_tensor)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
        labels = get_imagenet_labels()
        top3_prob, top3_catid = torch.topk(probabilities, 3)
        
        # Add bounds checking to prevent IndexError
        results = []
        for prob, catid in zip(top3_prob, top3_catid):
            catid_int = int(catid.item())
            if 0 <= catid_int < len(labels):
                results.append((labels[catid_int], float(prob)))
            else:
                # Fallback for out-of-bounds indices
                results.append((f"object_{catid_int}", float(prob)))
        
        return results
    except Exception as e:
        st.error(f"Error in image recognition: {str(e)}")
        # Return mock results if recognition fails
        return [
            ("interior", 0.85),
            ("furniture", 0.72),
            ("room", 0.68)
        ]

def analyze_via_api(image_bytes, filename):
    api_urls = [
        "http://localhost:3000/api/property/photo/analyzePhotos",
        "http://localhost:3001/api/property/photo/analyzePhotos",
    ]
    for url in api_urls:
        try:
            response = requests.post(
                url,
                files={"coverImage": (filename, image_bytes, "image/jpeg")},
                timeout=10
            )
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            continue
    return None

def mock_analyze(image: Image.Image) -> dict:
    # Enhanced mock analysis with more realistic data
    tags = ["interior", "exterior", "kitchen", "bedroom", "bathroom", "living room", "dining room", "office", "garden", "balcony"]
    score = np.round(np.random.uniform(0.7, 1.0), 2)
    selected_tags = np.random.choice(tags, size=np.random.randint(2, 5), replace=False)
    
    # Generate realistic property features
    features = {
        "condition": np.random.choice(["excellent", "good", "fair", "needs work"], p=[0.3, 0.4, 0.2, 0.1]),
        "style": np.random.choice(["modern", "traditional", "contemporary", "vintage"], p=[0.4, 0.3, 0.2, 0.1]),
        "lighting": np.random.choice(["bright", "moderate", "dim"], p=[0.5, 0.3, 0.2]),
        "cleanliness": np.random.uniform(0.6, 1.0),
        "space_utilization": np.random.uniform(0.5, 1.0)
    }
    
    return {
        "tags": list(selected_tags),
        "score": score,
        "features": features,
        "analysis_time": time.time()
    }

# Sidebar for controls
with st.sidebar:
    st.header("⚙️ Analysis Settings")
    
    analysis_mode = st.selectbox(
        "Analysis Mode",
        ["Real-time", "Batch Processing", "Detailed Analysis"],
        help="Choose how to process your images"
    )
    
    confidence_threshold = st.slider(
        "Confidence Threshold",
        min_value=0.1,
        max_value=1.0,
        value=0.7,
        step=0.1,
        help="Minimum confidence for tag detection"
    )
    
    enable_visualization = st.checkbox(
        "Enable Advanced Visualizations",
        value=True,
        help="Show charts and graphs"
    )
    
    st.markdown("---")
    st.markdown("### 📊 Statistics")
    if 'total_analyzed' not in st.session_state:
        st.session_state.total_analyzed = 0
    if 'avg_score' not in st.session_state:
        st.session_state.avg_score = 0.0
    
    st.metric("Images Analyzed", st.session_state.total_analyzed)
    st.metric("Average Score", f"{st.session_state.avg_score:.2f}")

# Main content area
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("📸 Upload Images")
    uploaded_files = st.file_uploader(
        "Upload property images",
        type=["jpg", "jpeg", "png", "webp"],
        accept_multiple_files=True,
        help="Select one or more property images to analyze"
    )

with col2:
    st.subheader("📈 Quick Stats")
    if uploaded_files:
        st.metric("Files to Process", len(uploaded_files))
        total_size = sum(file.size for file in uploaded_files)
        st.metric("Total Size", f"{total_size / 1024 / 1024:.1f} MB")
    else:
        st.info("No files uploaded yet")

# Analysis results storage
if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = []

if uploaded_files:
    st.markdown("---")
    st.subheader("🔍 Analysis Results")
    
    # Progress bar for batch processing
    if analysis_mode == "Batch Processing":
        progress_bar = st.progress(0)
        status_text = st.empty()
    
    for idx, file in enumerate(uploaded_files):
        st.markdown(f"### 📷 {file.name}")
        
        # Create columns for image and analysis
        img_col, analysis_col = st.columns([1, 1])
        
        with img_col:
            image = Image.open(file)
            st.image(image, caption=file.name, use_column_width=True)
        
        with analysis_col:
            with st.spinner(f"Analyzing {file.name}..."):
                # Update progress for batch mode
                if analysis_mode == "Batch Processing":
                    progress = (idx + 1) / len(uploaded_files)
                    progress_bar.progress(progress)
                    status_text.text(f"Processing {idx + 1} of {len(uploaded_files)}")
                
                # Send to backend API
                file_bytes = file.read()
                result = analyze_via_api(file_bytes, file.name)
                
                # Local image recognition
                recog_results = recognize_image(image)
                
                if result is None:
                    st.warning("Backend unavailable, using enhanced mock analysis.")
                    result = mock_analyze(image)
                
                # Store results for visualization
                analysis_data = {
                    'filename': file.name,
                    'timestamp': datetime.now(),
                    'tags': result.get("tags", []),
                    'score': result.get("score", 0.0),
                    'features': result.get("features", {}),
                    'recognition': recog_results
                }
                st.session_state.analysis_results.append(analysis_data)
                
                # Display results
                if isinstance(result, dict):
                    tags = result.get("tags") or result.get("predicted_tags") or []
                    score = result.get("score") or result.get("ml_score") or result.get("confidence")
                    
                    # Enhanced results display
                    st.markdown("#### 🏷️ Detected Tags")
                    if tags:
                        tag_cols = st.columns(3)
                        for i, tag in enumerate(tags[:6]):  # Show max 6 tags
                            with tag_cols[i % 3]:
                                st.markdown(f"• **{tag}**")
                    
                    st.markdown("#### 📊 Analysis Score")
                    if score is not None:
                        # Create a gauge chart
                        fig = go.Figure(go.Indicator(
                            mode = "gauge+number+delta",
                            value = score,
                            domain = {'x': [0, 1], 'y': [0, 1]},
                            title = {'text': "Confidence Score"},
                            delta = {'reference': 0.8},
                            gauge = {
                                'axis': {'range': [None, 1]},
                                'bar': {'color': "darkblue"},
                                'steps': [
                                    {'range': [0, 0.5], 'color': "lightgray"},
                                    {'range': [0.5, 0.8], 'color': "yellow"},
                                    {'range': [0.8, 1], 'color': "green"}
                                ],
                                'threshold': {
                                    'line': {'color': "red", 'width': 4},
                                    'thickness': 0.75,
                                    'value': 0.9
                                }
                            }
                        ))
                        fig.update_layout(height=300)
                        st.plotly_chart(fig, use_container_width=True)
                    
                    # Show features if available
                    if 'features' in result and result['features']:
                        st.markdown("#### 🏠 Property Features")
                        features = result['features']
                        feature_cols = st.columns(2)
                        with feature_cols[0]:
                            st.metric("Condition", features.get('condition', 'N/A'))
                            st.metric("Style", features.get('style', 'N/A'))
                        with feature_cols[1]:
                            st.metric("Lighting", features.get('lighting', 'N/A'))
                            st.metric("Cleanliness", f"{features.get('cleanliness', 0):.1f}")
                
                # Show image recognition results
                st.markdown("#### 🤖 AI Recognition Results")
                if recog_results:
                    recog_df = pd.DataFrame(recog_results, columns=['Object', 'Confidence'])
                    fig = px.bar(
                        recog_df, 
                        x='Confidence', 
                        y='Object',
                        orientation='h',
                        title="Top Recognized Objects"
                    )
                    fig.update_layout(height=300)
                    st.plotly_chart(fig, use_container_width=True)
        
        st.markdown("---")
    
    # Update session state
    if st.session_state.analysis_results:
        st.session_state.total_analyzed = len(st.session_state.analysis_results)
        st.session_state.avg_score = np.mean([r['score'] for r in st.session_state.analysis_results])

# Advanced Visualizations
if enable_visualization and st.session_state.analysis_results:
    st.markdown("---")
    st.subheader("📊 Advanced Analytics")
    
    # Create DataFrame for analysis
    df = pd.DataFrame(st.session_state.analysis_results)
    
    # Tag frequency analysis
    all_tags = []
    for tags in df['tags']:
        all_tags.extend(tags)
    
    if all_tags:
        tag_counts = pd.Series(all_tags).value_counts()
        fig = px.bar(
            x=tag_counts.index,
            y=tag_counts.values,
            title="Most Common Property Tags",
            labels={'x': 'Tags', 'y': 'Frequency'}
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Score distribution
    if 'score' in df.columns:
        fig = px.histogram(
            df, 
            x='score',
            nbins=10,
            title="Score Distribution",
            labels={'score': 'Confidence Score', 'count': 'Number of Images'}
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Timeline of analysis
    if 'timestamp' in df.columns:
        df['date'] = pd.to_datetime(df['timestamp']).dt.date
        daily_counts = df.groupby('date').size().reset_index(name='count')
        fig = px.line(
            daily_counts,
            x='date',
            y='count',
            title="Analysis Activity Over Time"
        )
        st.plotly_chart(fig, use_container_width=True)

# Footer
st.markdown("---")
st.caption("""
<div style='text-align: center; color: #666;'>
    🤖 ML Photo Analyzer | Powered by Streamlit & PyTorch | 
    <a href='#' target='_blank'>Documentation</a> | 
    <a href='#' target='_blank'>GitHub</a>
</div>
""", unsafe_allow_html=True)
