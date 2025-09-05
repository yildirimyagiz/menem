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
    from streamlit_pandas_profiling import st_profile_report
    from streamlit_searchbox import st_searchbox
    from st_click_detector import click_detector
    from streamlit_pills import pills
    from streamlit_scrollable_textbox import st_scrollable_textbox
    from st_card_component import card
except ImportError as e:
    st.error(f"Missing package: {e}")
    st.info("Please install required packages: pip install streamlit-pandas-profiling streamlit-searchbox st-click-detector streamlit-pills streamlit-scrollable-textbox st-card-component")

# Set page config
st.set_page_config(
    page_title="Advanced Property Analytics",
    page_icon="📊",
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
    .analytics-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .profiling-section {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
    }
    .search-container {
        background: #f8f9fa;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
    }
    .click-detector {
        background: #e9ecef;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Generate comprehensive property data
def generate_advanced_data():
    """Generate comprehensive property data for advanced analytics"""
    np.random.seed(42)
    random.seed(42)
    
    # Property types and their characteristics
    property_types = {
        'Apartment': {'base_price': 300000, 'size_range': (800, 1500), 'rooms': (1, 3), 'popularity': 0.8},
        'House': {'base_price': 500000, 'size_range': (1500, 3000), 'rooms': (2, 5), 'popularity': 0.9},
        'Condo': {'base_price': 400000, 'size_range': (1000, 2000), 'rooms': (1, 4), 'popularity': 0.7},
        'Villa': {'base_price': 800000, 'size_range': (2500, 5000), 'rooms': (3, 6), 'popularity': 0.6},
        'Penthouse': {'base_price': 1200000, 'size_range': (2000, 4000), 'rooms': (2, 5), 'popularity': 0.5},
        'Townhouse': {'base_price': 600000, 'size_range': (1800, 2800), 'rooms': (2, 4), 'popularity': 0.75},
        'Studio': {'base_price': 200000, 'size_range': (400, 800), 'rooms': (1, 1), 'popularity': 0.6},
        'Loft': {'base_price': 450000, 'size_range': (1200, 2000), 'rooms': (1, 2), 'popularity': 0.65}
    }
    
    # Cities and their market characteristics
    cities = {
        'New York': {'price_multiplier': 1.5, 'demand': 0.9, 'inventory': 0.3},
        'Los Angeles': {'price_multiplier': 1.3, 'demand': 0.8, 'inventory': 0.4},
        'Chicago': {'price_multiplier': 1.0, 'demand': 0.7, 'inventory': 0.6},
        'Miami': {'price_multiplier': 1.2, 'demand': 0.75, 'inventory': 0.5},
        'San Francisco': {'price_multiplier': 1.8, 'demand': 0.85, 'inventory': 0.2},
        'Austin': {'price_multiplier': 1.1, 'demand': 0.8, 'inventory': 0.7},
        'Seattle': {'price_multiplier': 1.4, 'demand': 0.8, 'inventory': 0.4},
        'Denver': {'price_multiplier': 1.15, 'demand': 0.75, 'inventory': 0.5}
    }
    
    properties = []
    
    for prop_type, specs in property_types.items():
        for i in range(15):  # 15 properties per type
            city = random.choice(list(cities.keys()))
            city_specs = cities[city]
            
            size = random.randint(*specs['size_range'])
            rooms = random.randint(*specs['rooms'])
            
            # Calculate price with market factors
            base_price = specs['base_price'] * city_specs['price_multiplier']
            price = base_price * random.uniform(0.8, 1.4)
            
            # ML score based on multiple factors
            ml_score = (
                specs['popularity'] * 0.3 +
                city_specs['demand'] * 0.3 +
                random.uniform(0.6, 0.95) * 0.4
            )
            
            # Generate realistic features
            all_features = ['Pool', 'Garden', 'Parking', 'Gym', 'Security', 'Balcony', 'Fireplace', 'Hardwood Floors', 'Central AC', 'Walk-in Closet']
            features = random.sample(all_features, random.randint(2, 6))
            
            # Status with realistic distribution
            status_weights = {'Available': 0.6, 'Under Contract': 0.25, 'Sold': 0.15}
            status = random.choices(list(status_weights.keys()), weights=list(status_weights.values()))[0]
            
            # Date added
            days_ago = random.randint(1, 365)
            date_added = datetime.now() - timedelta(days=days_ago)
            
            properties.append({
                'id': f"{prop_type}_{i+1}",
                'type': prop_type,
                'price': round(price, 2),
                'size': size,
                'rooms': rooms,
                'ml_score': round(ml_score, 3),
                'city': city,
                'status': status,
                'features': features,
                'date_added': date_added,
                'days_on_market': days_ago,
                'price_per_sqft': round(price / size, 2),
                'demand_score': round(city_specs['demand'], 2),
                'inventory_level': round(city_specs['inventory'], 2)
            })
    
    return pd.DataFrame(properties)

# Search functionality
def search_properties(search_term: str, df: pd.DataFrame) -> pd.DataFrame:
    """Search properties based on term"""
    if not search_term:
        return df
    
    search_term = search_term.lower()
    mask = (
        df['type'].str.lower().str.contains(search_term) |
        df['city'].str.lower().str.contains(search_term) |
        df['status'].str.lower().str.contains(search_term) |
        df['features'].apply(lambda x: any(term in str(f).lower() for f in x for term in search_term.split()))
    
    return df[mask]

# Click detector data
def generate_click_data():
    """Generate data for click detector"""
    return {
        "data": [
            {"id": "property-1", "content": "🏠 Apartment - $350,000", "click": "Apartment clicked!"},
            {"id": "property-2", "content": "🏡 House - $550,000", "click": "House clicked!"},
            {"id": "property-3", "content": "🏢 Condo - $420,000", "click": "Condo clicked!"},
            {"id": "property-4", "content": "🏰 Villa - $850,000", "click": "Villa clicked!"},
            {"id": "property-5", "content": "🏙️ Penthouse - $1,200,000", "click": "Penthouse clicked!"}
        ]
    }

def main():
    inject_global_css()
    st.set_page_config(page_title="Advanced Property Analytics", page_icon="📊", layout="wide", initial_sidebar_state="expanded")
    st.markdown('<h1 class="main-header">📊 Advanced Property Analytics</h1>', unsafe_allow_html=True)
    
    # Generate data
    df = generate_advanced_data()
    
    # Sidebar
    st.sidebar.header("🔧 Analytics Tools")
    
    analysis_mode = st.sidebar.selectbox(
        "Select Analysis Mode",
        ["Data Profiling", "Advanced Search", "Interactive Analytics", "Market Insights", "Property Cards", "Click Analytics"]
    )
    
    # Main content based on selected mode
    if analysis_mode == "Data Profiling":
        st.header("📈 Data Profiling & Analysis")
        
        # Data overview
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Properties", len(df))
        with col2:
            st.metric("Average Price", f"${df['price'].mean():,.0f}")
        with col3:
            st.metric("Average ML Score", f"{df['ml_score'].mean():.3f}")
        with col4:
            st.metric("Cities", df['city'].nunique())
        
        # Pandas profiling
        st.subheader("📊 Comprehensive Data Profile")
        
        try:
            # Create a profile report
            profile = df.profile_report(
                title="Property Data Profile",
                explorative=True,
                dark_mode=False
            )
            
            st_profile_report(profile, navbar=True)
            
        except Exception as e:
            st.error(f"Profiling error: {e}")
            st.info("Please ensure streamlit-pandas-profiling is installed")
            
            # Fallback to basic statistics
            st.subheader("Basic Statistics")
            st.dataframe(df.describe())
    
    elif analysis_mode == "Advanced Search":
        st.header("🔍 Advanced Property Search")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Smart Search")
            
            try:
                # Search box
                search_results = st_searchbox(
                    search_function=lambda search_term: search_properties(search_term, df),
                    placeholder="Search properties by type, city, features...",
                    label="Property Search",
                    default=None,
                    clear_on_submit=False,
                    show_suggestions=True,
                    key="property_search"
                )
                
                if search_results is not None:
                    st.success(f"Found {len(search_results)} properties")
                    st.dataframe(search_results, use_container_width=True)
                    
                    # Search analytics
                    if len(search_results) > 0:
                        col1, col2 = st.columns(2)
                        
                        with col1:
                            fig_price = px.histogram(
                                search_results,
                                x='price',
                                title='Price Distribution (Search Results)'
                            )
                            st.plotly_chart(fig_price, use_container_width=True)
                        
                        with col2:
                            fig_type = px.pie(
                                search_results,
                                names='type',
                                title='Property Types (Search Results)'
                            )
                            st.plotly_chart(fig_type, use_container_width=True)
                
            except Exception as e:
                st.error(f"Search error: {e}")
                st.info("Please ensure streamlit-searchbox is installed")
        
        with col2:
            st.subheader("Search Filters")
            
            # Property type filter
            selected_types = st.multiselect(
                "Property Types",
                df['type'].unique(),
                default=df['type'].unique()[:3]
            )
            
            # City filter
            selected_cities = st.multiselect(
                "Cities",
                df['city'].unique(),
                default=df['city'].unique()[:3]
            )
            
            # Price range
            price_range = st.slider(
                "Price Range",
                min_value=int(df['price'].min()),
                max_value=int(df['price'].max()),
                value=(int(df['price'].min()), int(df['price'].max()))
            
            # Apply filters
            filtered_df = df[
                (df['type'].isin(selected_types)) &
                (df['city'].isin(selected_cities)) &
                (df['price'] >= price_range[0]) &
                (df['price'] <= price_range[1])
            ]
            
            st.metric("Filtered Results", len(filtered_df))
    
    elif analysis_mode == "Interactive Analytics":
        st.header("🎯 Interactive Analytics")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Interactive Property Selection")
            
            try:
                # Pills for property types
                selected_property_types = pills(
                    "Select Property Types",
                    df['type'].unique().tolist(),
                    df['type'].unique()[:3].tolist(),
                    key="property_pills"
                )
                
                # Filter data based on selection
                filtered_data = df[df['type'].isin(selected_property_types)]
                
                if len(filtered_data) > 0:
                    # Interactive charts
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        fig_scatter = px.scatter(
                            filtered_data,
                            x='price',
                            y='ml_score',
                            color='type',
                            size='size',
                            hover_data=['city', 'rooms'],
                            title='Price vs ML Score'
                        )
                        st.plotly_chart(fig_scatter, use_container_width=True)
                    
                    with col2:
                        fig_box = px.box(
                            filtered_data,
                            x='type',
                            y='price',
                            title='Price Distribution by Type'
                        )
                        st.plotly_chart(fig_box, use_container_width=True)
                
            except Exception as e:
                st.error(f"Interactive analytics error: {e}")
                st.info("Please ensure streamlit-pills is installed")
        
        with col2:
            st.subheader("Analytics Controls")
            
            # ML Score threshold
            ml_threshold = st.slider(
                "ML Score Threshold",
                min_value=0.0,
                max_value=1.0,
                value=0.7,
                step=0.05
            )
            
            # Filter by ML score
            high_ml_properties = df[df['ml_score'] >= ml_threshold]
            st.metric("High ML Score Properties", len(high_ml_properties))
            
            # Price per square foot analysis
            avg_price_per_sqft = df['price_per_sqft'].mean()
            st.metric("Avg Price per Sq Ft", f"${avg_price_per_sqft:.2f}")
    
    elif analysis_mode == "Market Insights":
        st.header("📊 Market Insights")
        
        # Market trends
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Market Performance by City")
            
            city_metrics = df.groupby('city').agg({
                'price': ['mean', 'count'],
                'ml_score': 'mean',
                'days_on_market': 'mean'
            }).round(2)
            
            city_metrics.columns = ['Avg Price', 'Property Count', 'Avg ML Score', 'Avg Days on Market']
            st.dataframe(city_metrics, use_container_width=True)
        
        with col2:
            st.subheader("Property Type Performance")
            
            type_metrics = df.groupby('type').agg({
                'price': 'mean',
                'ml_score': 'mean',
                'days_on_market': 'mean'
            }).round(2)
            
            type_metrics.columns = ['Avg Price', 'Avg ML Score', 'Avg Days on Market']
            st.dataframe(type_metrics, use_container_width=True)
        
        # Advanced analytics
        st.subheader("Market Trends Analysis")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Price trends by property type
            fig_trends = px.line(
                df.groupby(['type', 'city'])['price'].mean().reset_index(),
                x='city',
                y='price',
                color='type',
                title='Average Price by City and Property Type'
            )
            st.plotly_chart(fig_trends, use_container_width=True)
        
        with col2:
            # ML Score vs Demand
            fig_demand = px.scatter(
                df,
                x='demand_score',
                y='ml_score',
                color='type',
                size='price',
                title='ML Score vs Market Demand'
            )
            st.plotly_chart(fig_demand, use_container_width=True)
    
    elif analysis_mode == "Property Cards":
        st.header("🏠 Property Cards Display")
        
        try:
            # Display properties as cards
            for idx, row in df.head(10).iterrows():
                with st.container():
                    col1, col2, col3 = st.columns([1, 2, 1])
                    
                    with col1:
                        # Property image placeholder
                        st.image(
                            "https://via.placeholder.com/150x100/667eea/ffffff?text=Property",
                            width=150
                        )
                    
                    with col2:
                        st.markdown(f"""
                        **{row['type']} - {row['city']}**
                        
                        💰 **${row['price']:,.0f}** | 🏠 **{row['rooms']} rooms** | 📏 **{row['size']} sq ft**
                        
                        🎯 **ML Score:** {row['ml_score']:.3f} | 📍 **Status:** {row['status']}
                        
                        🏷️ **Features:** {', '.join(row['features'][:3])}
                        """)
                    
                    with col3:
                        if st.button(f"View Details {idx}", key=f"details_{idx}"):
                            st.success(f"Selected: {row['type']} in {row['city']}")
            
        except Exception as e:
            st.error(f"Card display error: {e}")
    
    elif analysis_mode == "Click Analytics":
        st.header("🖱️ Click Analytics")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Interactive Property Selection")
            
            try:
                # Click detector
                click_data = generate_click_data()
                
                clicked = click_detector(
                    html=click_data,
                    key="property_clicker"
                )
                
                if clicked:
                    st.success(f"Clicked: {clicked}")
                    
                    # Show analytics for clicked property
                    if "Apartment" in clicked:
                        st.info("Apartment Analytics: High demand, moderate price range")
                    elif "House" in clicked:
                        st.info("House Analytics: Premium segment, high ML scores")
                    elif "Condo" in clicked:
                        st.info("Condo Analytics: Urban market, good investment potential")
                    elif "Villa" in clicked:
                        st.info("Villa Analytics: Luxury segment, high-end market")
                    elif "Penthouse" in clicked:
                        st.info("Penthouse Analytics: Ultra-luxury, exclusive market")
                
            except Exception as e:
                st.error(f"Click detector error: {e}")
                st.info("Please ensure st-click-detector is installed")
        
        with col2:
            st.subheader("Click Analytics")
            
            # Simulate click tracking
            if 'click_count' not in st.session_state:
                st.session_state.click_count = 0
            
            if st.button("Simulate Click"):
                st.session_state.click_count += 1
                st.success(f"Total clicks: {st.session_state.click_count}")
            
            # Click metrics
            st.metric("Total Interactions", st.session_state.click_count)
            st.metric("Avg Session Time", "2.5 min")
            st.metric("Conversion Rate", "12.5%")
    
    # Scrollable textbox for detailed analysis
    st.markdown("---")
    st.subheader("📝 Detailed Analysis Report")
    
    try:
        analysis_report = f"""
        # Property Market Analysis Report
        
        ## Executive Summary
        - Total Properties Analyzed: {len(df)}
        - Average Market Price: ${df['price'].mean():,.0f}
        - Market Coverage: {df['city'].nunique()} cities
        - Property Types: {df['type'].nunique()} categories
        
        ## Key Insights
        1. **Price Distribution**: Properties range from ${df['price'].min():,.0f} to ${df['price'].max():,.0f}
        2. **ML Score Performance**: Average ML confidence score of {df['ml_score'].mean():.3f}
        3. **Market Demand**: Top performing cities show high demand scores
        4. **Property Types**: {df['type'].value_counts().index[0]} is the most common property type
        
        ## Recommendations
        - Focus on high ML score properties for better returns
        - Consider market demand when pricing properties
        - Monitor inventory levels in high-demand cities
        - Leverage advanced analytics for market insights
        
        Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        st_scrollable_textbox(
            analysis_report,
            height=300,
            border=True,
            key="analysis_report"
        )
        
    except Exception as e:
        st.error(f"Scrollable textbox error: {e}")
        st.info("Please ensure streamlit-scrollable-textbox is installed")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666;">
        <p>📊 Advanced Property Analytics - Powered by AI/ML Technologies</p>
        <p>Features: Data Profiling • Advanced Search • Interactive Analytics • Market Insights • Property Cards • Click Analytics</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main() 