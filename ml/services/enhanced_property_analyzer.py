import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
import random
from datetime import datetime, timedelta
import json
import base64
from PIL import Image
import io

# Import the new Streamlit packages
try:
    from streamlit_image_comparison import image_comparison
    from streamlit_sparrow_labeling import st_sparrow_labeling
    from streamlit_camera_input_live import camera_input_live
    from streamlit_chatbox import st_chatbox
except ImportError as e:
    st.error(f"Missing package: {e}")
    st.info("Please install required packages: pip install streamlit-image-comparison streamlit-sparrow-labeling streamlit-camera-input-live streamlit-chatbox")

# Set page config
st.set_page_config(
    page_title="Enhanced Property Analyzer",
    page_icon="🏠",
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
    .feature-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .analysis-result {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
    }
    .chat-container {
        background: #f8f9fa;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Generate sample property data for comparison
def generate_comparison_data():
    """Generate sample property data for comparison analysis"""
    properties = []
    
    # Sample property types and their characteristics
    property_types = {
        'Apartment': {'base_price': 300000, 'size_range': (800, 1500), 'rooms': (1, 3)},
        'House': {'base_price': 500000, 'size_range': (1500, 3000), 'rooms': (2, 5)},
        'Condo': {'base_price': 400000, 'size_range': (1000, 2000), 'rooms': (1, 4)},
        'Villa': {'base_price': 800000, 'size_range': (2500, 5000), 'rooms': (3, 6)},
        'Penthouse': {'base_price': 1200000, 'size_range': (2000, 4000), 'rooms': (2, 5)}
    }
    
    for prop_type, specs in property_types.items():
        for i in range(3):  # 3 properties per type
            size = random.randint(*specs['size_range'])
            rooms = random.randint(*specs['rooms'])
            price = specs['base_price'] * random.uniform(0.8, 1.3)
            ml_score = random.uniform(0.7, 0.95)
            
            properties.append({
                'id': f"{prop_type}_{i+1}",
                'type': prop_type,
                'price': round(price, 2),
                'size': size,
                'rooms': rooms,
                'ml_score': round(ml_score, 2),
                'location': f"Location {i+1}",
                'status': random.choice(['Available', 'Under Contract', 'Sold']),
                'features': random.sample(['Pool', 'Garden', 'Parking', 'Gym', 'Security'], random.randint(2, 4))
            })
    
    return pd.DataFrame(properties)

# Generate sample images for comparison
def generate_sample_images():
    """Generate sample images for property comparison"""
    # Create sample images with different colors to represent different properties
    images = {}
    
    for prop_type in ['Apartment', 'House', 'Condo', 'Villa', 'Penthouse']:
        # Create a simple colored image for each property type
        img = Image.new('RGB', (400, 300), color=(
            random.randint(100, 200),
            random.randint(100, 200),
            random.randint(100, 200)
        ))
        
        # Convert to base64 for display
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        images[prop_type] = f"data:image/png;base64,{img_str}"
    
    return images

# Chat functionality
def initialize_chat():
    """Initialize chat session"""
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "Hello! I'm your AI property analyst. I can help you analyze properties, compare features, and provide insights. What would you like to know?"}
        ]

def add_message(role, content):
    """Add a message to the chat"""
    st.session_state.messages.append({"role": role, "content": content})

def get_ai_response(user_input):
    """Generate AI response based on user input"""
    responses = {
        "compare": "I can help you compare properties! Use the image comparison tool to analyze different property types and their features.",
        "analyze": "Let me analyze the property data for you. I can provide insights on pricing trends, market analysis, and property recommendations.",
        "camera": "Great! You can use the live camera input to capture property photos for real-time analysis.",
        "label": "The labeling tool allows you to annotate property features and create custom datasets for analysis."
    }
    
    user_input_lower = user_input.lower()
    
    for key, response in responses.items():
        if key in user_input_lower:
            return response
    
    return "I understand you're interested in property analysis. I can help you with comparison, analysis, camera input, and labeling features. What specific aspect would you like to explore?"

def main():
    st.markdown('<h1 class="main-header">🏠 Enhanced Property Analyzer</h1>', unsafe_allow_html=True)
    
    # Initialize chat
    initialize_chat()
    
    # Sidebar
    st.sidebar.header("🔧 Analysis Tools")
    
    analysis_mode = st.sidebar.selectbox(
        "Select Analysis Mode",
        ["Image Comparison", "Property Labeling", "Live Camera Analysis", "AI Chat Assistant", "Comprehensive Analysis"]
    )
    
    # Main content based on selected mode
    if analysis_mode == "Image Comparison":
        st.header("🖼️ Property Image Comparison")
        
        # Generate sample images
        sample_images = generate_sample_images()
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Before vs After Analysis")
            
            # Image comparison tool
            try:
                image_comparison(
                    img1=sample_images['Apartment'],
                    img2=sample_images['House'],
                    label1="Apartment",
                    label2="House"
                )
            except Exception as e:
                st.error(f"Image comparison error: {e}")
                st.info("Please ensure streamlit-image-comparison is installed")
        
        with col2:
            st.subheader("Property Comparison Metrics")
            
            # Generate comparison data
            df = generate_comparison_data()
            
            # Property type comparison
            fig = px.bar(
                df.groupby('type')['price'].mean().reset_index(),
                x='type',
                y='price',
                title='Average Price by Property Type',
                color='type'
            )
            st.plotly_chart(fig, use_container_width=True)
    
    elif analysis_mode == "Property Labeling":
        st.header("🏷️ Property Feature Labeling")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Interactive Property Labeling")
            
            # Sample image for labeling
            sample_img = Image.new('RGB', (600, 400), color=(200, 200, 200))
            buffer = io.BytesIO()
            sample_img.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            try:
                # Property labeling tool
                result = st_sparrow_labeling(
                    img_str,
                    label_tool="polygon",
                    key="property_labeling"
                )
                
                if result:
                    st.success("Labels saved successfully!")
                    st.json(result)
            except Exception as e:
                st.error(f"Labeling error: {e}")
                st.info("Please ensure streamlit-sparrow-labeling is installed")
        
        with col2:
            st.subheader("Labeling Instructions")
            st.markdown("""
            **How to use the labeling tool:**
            1. Click on the image to start drawing
            2. Create polygons around property features
            3. Add labels for each feature
            4. Save your annotations
            
            **Common property features to label:**
            - Bedrooms
            - Bathrooms
            - Kitchen
            - Living room
            - Balcony/Terrace
            - Parking spaces
            - Amenities
            """)
    
    elif analysis_mode == "Live Camera Analysis":
        st.header("📷 Live Camera Property Analysis")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Capture Property Photos")
            
            try:
                # Live camera input
                camera_photo = camera_input_live(
                    key="property_camera",
                    help_text="Take a photo of the property for analysis"
                )
                
                if camera_photo:
                    st.success("Photo captured successfully!")
                    
                    # Display the captured image
                    st.image(camera_photo, caption="Captured Property Photo", use_column_width=True)
                    
                    # Simulate analysis
                    analysis_result = {
                        "property_type": random.choice(["Apartment", "House", "Condo"]),
                        "estimated_price": random.randint(200000, 800000),
                        "confidence": round(random.uniform(0.7, 0.95), 2),
                        "detected_features": random.sample(["Bedroom", "Kitchen", "Living Room", "Bathroom"], 3)
                    }
                    
                    st.subheader("AI Analysis Results")
                    st.json(analysis_result)
                    
            except Exception as e:
                st.error(f"Camera input error: {e}")
                st.info("Please ensure streamlit-camera-input-live is installed")
        
        with col2:
            st.subheader("Camera Analysis Tips")
            st.markdown("""
            **For best results:**
            - Ensure good lighting
            - Capture the entire property
            - Include key features
            - Take multiple angles
            
            **Analysis features:**
            - Property type detection
            - Price estimation
            - Feature recognition
            - Quality assessment
            """)
    
    elif analysis_mode == "AI Chat Assistant":
        st.header("🤖 AI Property Assistant")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Chat with AI Property Analyst")
            
            try:
                # Chat interface
                chat_response = st_chatbox(
                    st.session_state.messages,
                    key="property_chat"
                )
                
                if chat_response:
                    add_message("user", chat_response)
                    
                    # Generate AI response
                    ai_response = get_ai_response(chat_response)
                    add_message("assistant", ai_response)
                    
                    st.rerun()
                    
            except Exception as e:
                st.error(f"Chat error: {e}")
                st.info("Please ensure streamlit-chatbox is installed")
        
        with col2:
            st.subheader("Chat Commands")
            st.markdown("""
            **Try these commands:**
            - "Compare properties"
            - "Analyze market trends"
            - "Use camera input"
            - "Label property features"
            - "Get price estimates"
            - "Property recommendations"
            """)
    
    elif analysis_mode == "Comprehensive Analysis":
        st.header("📊 Comprehensive Property Analysis")
        
        # Generate comprehensive data
        df = generate_comparison_data()
        
        # Multiple analysis tabs
        tab1, tab2, tab3, tab4 = st.tabs(["📈 Market Analysis", "🏠 Property Comparison", "💰 Price Analysis", "🎯 ML Insights"])
        
        with tab1:
            st.subheader("Market Trends")
            
            col1, col2 = st.columns(2)
            
            with col1:
                # Price distribution
                fig_price = px.histogram(
                    df,
                    x='price',
                    color='type',
                    title='Price Distribution by Property Type',
                    labels={'price': 'Price ($)', 'type': 'Property Type'}
                )
                st.plotly_chart(fig_price, use_container_width=True)
            
            with col2:
                # ML Score vs Price
                fig_scatter = px.scatter(
                    df,
                    x='price',
                    y='ml_score',
                    color='type',
                    size='size',
                    title='ML Score vs Price',
                    labels={'price': 'Price ($)', 'ml_score': 'ML Score'}
                )
                st.plotly_chart(fig_scatter, use_container_width=True)
        
        with tab2:
            st.subheader("Property Comparison")
            
            # Comparison table
            st.dataframe(
                df.groupby('type').agg({
                    'price': ['mean', 'min', 'max'],
                    'size': 'mean',
                    'ml_score': 'mean'
                }).round(2),
                use_container_width=True
            )
            
            # Property features comparison
            all_features = []
            for features in df['features']:
                all_features.extend(features)
            
            feature_counts = pd.Series(all_features).value_counts()
            
            fig_features = px.bar(
                x=feature_counts.index,
                y=feature_counts.values,
                title='Most Common Property Features'
            )
            st.plotly_chart(fig_features, use_container_width=True)
        
        with tab3:
            st.subheader("Price Analysis")
            
            col1, col2 = st.columns(2)
            
            with col1:
                # Price by property type
                fig_box = px.box(
                    df,
                    x='type',
                    y='price',
                    title='Price Distribution by Property Type'
                )
                st.plotly_chart(fig_box, use_container_width=True)
            
            with col2:
                # Price vs Size correlation
                fig_corr = px.scatter(
                    df,
                    x='size',
                    y='price',
                    color='type',
                    title='Price vs Size Correlation'
                )
                st.plotly_chart(fig_corr, use_container_width=True)
        
        with tab4:
            st.subheader("ML Insights")
            
            # ML Score analysis
            col1, col2 = st.columns(2)
            
            with col1:
                fig_ml = px.histogram(
                    df,
                    x='ml_score',
                    color='type',
                    title='ML Score Distribution',
                    labels={'ml_score': 'ML Score'}
                )
                st.plotly_chart(fig_ml, use_container_width=True)
            
            with col2:
                # ML Score vs Rooms
                fig_rooms = px.scatter(
                    df,
                    x='rooms',
                    y='ml_score',
                    color='type',
                    title='ML Score vs Number of Rooms'
                )
                st.plotly_chart(fig_rooms, use_container_width=True)
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666;">
        <p>🏠 Enhanced Property Analyzer - Powered by AI/ML Technologies</p>
        <p>Features: Image Comparison • Property Labeling • Live Camera • AI Chat • Comprehensive Analysis</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main() 