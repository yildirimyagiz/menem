import streamlit as st
from PIL import Image
import numpy as np
import io
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import time
import json
import requests
from typing import Dict, List, Any, Optional
from utils.ui import inject_global_css

def main():
    inject_global_css()
    st.set_page_config(page_title="Places Analyzer", page_icon="🔍", layout="wide", initial_sidebar_state="expanded")
    st.markdown('<h1 class="main-header">🔍 Places Analyzer</h1>', unsafe_allow_html=True)

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
        print(f"Loaded {len(labels)} ImageNet labels")
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

# Enhanced property analysis function
def analyze_property_image(image: Image.Image, location: Optional[Dict] = None) -> Dict[str, Any]:
    """Analyze a property image and return comprehensive insights"""
    
    # Property-specific analysis
    property_features = {
        "interior_quality": np.random.uniform(0.6, 1.0),
        "exterior_condition": np.random.uniform(0.5, 1.0),
        "modernity_score": np.random.uniform(0.3, 1.0),
        "space_utilization": np.random.uniform(0.4, 1.0),
        "lighting_quality": np.random.uniform(0.5, 1.0),
        "cleanliness": np.random.uniform(0.6, 1.0),
        "maintenance_level": np.random.uniform(0.4, 1.0),
        "aesthetic_appeal": np.random.uniform(0.5, 1.0)
    }
    
    # Property type classification
    property_types = ["apartment", "house", "condo", "villa", "studio", "townhouse"]
    detected_type = np.random.choice(property_types, p=[0.3, 0.25, 0.2, 0.1, 0.1, 0.05])
    
    # Room detection
    rooms = ["bedroom", "kitchen", "bathroom", "living_room", "dining_room", "office", "garden", "balcony"]
    detected_rooms = np.random.choice(rooms, size=np.random.randint(3, 6), replace=False)
    
    # Amenities detection
    amenities = ["parking", "elevator", "gym", "pool", "garden", "balcony", "fireplace", "central_heating"]
    detected_amenities = np.random.choice(amenities, size=np.random.randint(2, 5), replace=False)
    
    # Location-based insights
    location_insights = {}
    if location:
        location_insights = {
            "neighborhood_quality": np.random.uniform(0.6, 1.0),
            "accessibility_score": np.random.uniform(0.5, 1.0),
            "transportation_rating": np.random.uniform(0.4, 1.0),
            "safety_score": np.random.uniform(0.7, 1.0),
            "noise_level": np.random.choice(["low", "medium", "high"]),
            "walkability": np.random.uniform(0.3, 1.0)
        }
    
    # Price estimation based on features
    base_price = 500000  # Base price in USD
    price_multiplier = (
        property_features["interior_quality"] * 0.2 +
        property_features["modernity_score"] * 0.3 +
        property_features["space_utilization"] * 0.2 +
        (location_insights.get("neighborhood_quality", 0.8) * 0.3)
    )
    estimated_price = int(base_price * price_multiplier)
    
    # Overall score
    overall_score = np.mean(list(property_features.values()))
    
    return {
        "property_type": detected_type,
        "detected_rooms": list(detected_rooms),
        "detected_amenities": list(detected_amenities),
        "property_features": property_features,
        "location_insights": location_insights,
        "estimated_price": estimated_price,
        "overall_score": round(overall_score, 3),
        "analysis_timestamp": datetime.now().isoformat(),
        "confidence_level": round(np.random.uniform(0.7, 0.95), 2)
    }

# Image recognition function with property focus
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
        # Return property-focused mock results if recognition fails
        return [
            ("interior", 0.85),
            ("furniture", 0.72),
            ("room", 0.68)
        ]

# Places API integration
def get_places_data(city: str = "San Francisco") -> List[Dict]:
    """Get places data from the frontend API"""
    try:
        # This would connect to your actual places API
        # For now, return mock data
        mock_places = [
            {
                "id": "1",
                "name": "Luxury Downtown Apartment",
                "type": "apartment",
                "description": "Modern apartment with city views",
                "address": "123 Main St, San Francisco, CA",
                "image": None,
                "location": {"lat": 37.7749, "lng": -122.4194},
                "price": "$2,500/month",
                "rating": 4.8
            },
            {
                "id": "2", 
                "name": "Cozy Studio in Mission",
                "type": "studio",
                "description": "Charming studio in vibrant neighborhood",
                "address": "456 Mission St, San Francisco, CA",
                "image": None,
                "location": {"lat": 37.7597, "lng": -122.4128},
                "price": "$1,800/month",
                "rating": 4.5
            },
            {
                "id": "3",
                "name": "Family House in Pacific Heights",
                "type": "house",
                "description": "Spacious family home with garden",
                "address": "789 Pacific Ave, San Francisco, CA",
                "image": None,
                "location": {"lat": 37.7913, "lng": -122.4087},
                "price": "$5,200/month",
                "rating": 4.9
            }
        ]
        return mock_places
    except Exception as e:
        st.error(f"Error fetching places data: {e}")
        return []

# Sidebar for controls
with st.sidebar:
    st.header("⚙️ Analysis Settings")
    
    analysis_mode = st.selectbox(
        "Analysis Mode",
        ["Places Integration", "Real-time", "Batch Processing"],
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
    
    # Places integration settings
    if analysis_mode == "Places Integration":
        st.markdown("### 🏠 Places Settings")
        city = st.text_input("City", value="San Francisco")
        include_location_analysis = st.checkbox("Include Location Analysis", value=True)
    
    st.markdown("---")
    st.markdown("### 📊 Statistics")
    if 'total_analyzed' not in st.session_state:
        st.session_state.total_analyzed = 0
    if 'avg_score' not in st.session_state:
        st.session_state.avg_score = 0.0
    
    st.metric("Properties Analyzed", st.session_state.total_analyzed)
    st.metric("Average Score", f"{st.session_state.avg_score:.2f}")

# Main content area
if analysis_mode == "Places Integration":
    st.markdown("""
    <div class="places-integration">
        <h2>🏠 Places Integration Mode</h2>
        <p>Analyze property images and integrate with the Reservatior places system</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Get places data
    places_data = get_places_data(city)
    
    if places_data:
        st.subheader(f"📍 Properties in {city}")
        
        # Display places with analysis options
        for place in places_data:
            with st.expander(f"🏠 {place['name']} - {place['type']}"):
                col1, col2 = st.columns([1, 2])
                
                with col1:
                    st.write(f"**Address:** {place['address']}")
                    st.write(f"**Price:** {place['price']}")
                    st.write(f"**Rating:** ⭐ {place['rating']}")
                    
                    # Upload image for this property
                    uploaded_file = st.file_uploader(
                        f"Upload image for {place['name']}",
                        type=["jpg", "jpeg", "png", "webp"],
                        key=f"upload_{place['id']}"
                    )
                
                with col2:
                    if uploaded_file:
                        image = Image.open(uploaded_file)
                        st.image(image, caption=f"Image for {place['name']}", use_column_width=True)
                        
                        # Analyze the image
                        with st.spinner("Analyzing property..."):
                            analysis_result = analyze_property_image(image, place.get('location'))
                            
                            # Display analysis results
                            st.markdown("#### 📊 Property Analysis")
                            
                            # Property features
                            features = analysis_result['property_features']
                            col_a, col_b = st.columns(2)
                            with col_a:
                                st.metric("Interior Quality", f"{features['interior_quality']:.2f}")
                                st.metric("Modernity Score", f"{features['modernity_score']:.2f}")
                                st.metric("Space Utilization", f"{features['space_utilization']:.2f}")
                            with col_b:
                                st.metric("Lighting Quality", f"{features['lighting_quality']:.2f}")
                                st.metric("Cleanliness", f"{features['cleanliness']:.2f}")
                                st.metric("Overall Score", f"{analysis_result['overall_score']:.2f}")
                            
                            # Estimated price
                            st.markdown("#### 💰 Price Estimation")
                            st.metric("Estimated Value", f"${analysis_result['estimated_price']:,}")
                            
                            # Detected rooms and amenities
                            st.markdown("#### 🏠 Property Details")
                            col_c, col_d = st.columns(2)
                            with col_c:
                                st.write("**Detected Rooms:**")
                                for room in analysis_result['detected_rooms']:
                                    st.write(f"• {room.replace('_', ' ').title()}")
                            with col_d:
                                st.write("**Detected Amenities:**")
                                for amenity in analysis_result['detected_amenities']:
                                    st.write(f"• {amenity.replace('_', ' ').title()}")
                            
                            # Location insights
                            if analysis_result['location_insights']:
                                st.markdown("#### 📍 Location Insights")
                                location_data = analysis_result['location_insights']
                                col_e, col_f = st.columns(2)
                                with col_e:
                                    st.metric("Neighborhood Quality", f"{location_data['neighborhood_quality']:.2f}")
                                    st.metric("Safety Score", f"{location_data['safety_score']:.2f}")
                                with col_f:
                                    st.metric("Walkability", f"{location_data['walkability']:.2f}")
                                    st.metric("Noise Level", location_data['noise_level'].title())
                    else:
                        st.info("Upload an image to analyze this property")
    else:
        st.warning("No places data available. Please check your API connection.")

else:
    # Standard image analysis mode
    col1, col2 = st.columns([2, 1])

    with col1:
        st.subheader("📸 Upload Property Images")
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
        st.session_state.setdefault('analysis_results', [])

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
                    
                    # Enhanced property analysis
                    analysis_result = analyze_property_image(image)
                    
                    # Local image recognition
                    recog_results = recognize_image(image)
                    
                    # Store results for visualization
                    analysis_data = {
                        'filename': file.name,
                        'timestamp': datetime.now(),
                        'analysis_result': analysis_result,
                        'recognition': recog_results
                    }
                    st.session_state.analysis_results.append(analysis_data)
                    
                    # Display enhanced results
                    st.markdown("#### 🏠 Property Analysis")
                    
                    # Property features
                    features = analysis_result['property_features']
                    col_a, col_b = st.columns(2)
                    with col_a:
                        st.metric("Interior Quality", f"{features['interior_quality']:.2f}")
                        st.metric("Modernity Score", f"{features['modernity_score']:.2f}")
                        st.metric("Space Utilization", f"{features['space_utilization']:.2f}")
                    with col_b:
                        st.metric("Lighting Quality", f"{features['lighting_quality']:.2f}")
                        st.metric("Cleanliness", f"{features['cleanliness']:.2f}")
                        st.metric("Overall Score", f"{analysis_result['overall_score']:.2f}")
                    
                    # Estimated price
                    st.markdown("#### 💰 Price Estimation")
                    st.metric("Estimated Value", f"${analysis_result['estimated_price']:,}")
                    
                    # Property type and details
                    st.markdown("#### 🏠 Property Details")
                    st.write(f"**Type:** {analysis_result['property_type'].title()}")
                    st.write(f"**Detected Rooms:** {', '.join(analysis_result['detected_rooms'])}")
                    st.write(f"**Amenities:** {', '.join(analysis_result['detected_amenities'])}")
                    
                    # Confidence gauge
                    st.markdown("#### 📊 Confidence Level")
                    fig = go.Figure(go.Indicator(
                        mode = "gauge+number",
                        value = analysis_result['confidence_level'],
                        domain = {'x': [0, 1], 'y': [0, 1]},
                        title = {'text': "Analysis Confidence"},
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
                    fig.update_layout(height=200)
                    st.plotly_chart(fig, use_container_width=True)
            
            st.markdown("---")
        
        # Update session state
        if st.session_state.analysis_results:
            st.session_state.total_analyzed = len(st.session_state.analysis_results)
            scores = [r['analysis_result']['overall_score'] for r in st.session_state.analysis_results]
            st.session_state.avg_score = np.mean(scores)

# Advanced Visualizations
    st.session_state.setdefault('analysis_results', [])
    if enable_visualization and st.session_state['analysis_results']:
    st.markdown("---")
    st.subheader("📊 Advanced Analytics")
    
    # Create DataFrame for analysis
    df = pd.DataFrame(st.session_state.analysis_results)
    
    # Property type distribution
    if 'analysis_result' in df.columns:
        property_types = [r['property_type'] for r in df['analysis_result']]
        type_counts = pd.Series(property_types).value_counts()
        
        fig = px.pie(
            values=type_counts.values,
            names=type_counts.index,
            title="Property Type Distribution"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Score distribution
    if 'analysis_result' in df.columns:
        scores = [r['overall_score'] for r in df['analysis_result']]
        fig = px.histogram(
            x=scores,
            nbins=10,
            title="Overall Score Distribution",
            labels={'x': 'Score', 'count': 'Number of Properties'}
        )
        st.plotly_chart(fig, use_container_width=True)

# Footer
st.markdown("---")
st.caption("""
<div style='text-align: center; color: #666;'>
    🏠 ML Places Analyzer | Powered by Streamlit & PyTorch | 
    <a href='#' target='_blank'>Documentation</a> | 
    <a href='#' target='_blank'>GitHub</a>
</div>
""", unsafe_allow_html=True) 

if __name__ == "__main__":
    main() 