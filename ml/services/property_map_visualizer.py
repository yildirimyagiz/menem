import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
import random
from datetime import datetime, timedelta
import folium
from streamlit_folium import st_folium
import json
from utils.ui import inject_global_css

def generate_sample_properties() -> pd.DataFrame:
    """Generate realistic sample property data with coordinates and values."""
    
    # Major cities with coordinates
    cities = {
        'New York': {'lat': 40.7128, 'lng': -74.0060, 'base_price': 800000},
        'Los Angeles': {'lat': 34.0522, 'lng': -118.2437, 'base_price': 650000},
        'Chicago': {'lat': 41.8781, 'lng': -87.6298, 'base_price': 350000},
        'Houston': {'lat': 29.7604, 'lng': -95.3698, 'base_price': 280000},
        'Phoenix': {'lat': 33.4484, 'lng': -112.0740, 'base_price': 320000},
        'Philadelphia': {'lat': 39.9526, 'lng': -75.1652, 'base_price': 250000},
        'San Antonio': {'lat': 29.4241, 'lng': -98.4936, 'base_price': 220000},
        'San Diego': {'lat': 32.7157, 'lng': -117.1611, 'base_price': 700000},
        'Dallas': {'lat': 32.7767, 'lng': -96.7970, 'base_price': 300000},
        'San Jose': {'lat': 37.3382, 'lng': -121.8863, 'base_price': 1000000},
        'Austin': {'lat': 30.2672, 'lng': -97.7431, 'base_price': 450000},
        'Jacksonville': {'lat': 30.3322, 'lng': -81.6557, 'base_price': 250000},
        'Fort Worth': {'lat': 32.7555, 'lng': -97.3308, 'base_price': 280000},
        'Columbus': {'lat': 39.9612, 'lng': -82.9988, 'base_price': 200000},
        'Charlotte': {'lat': 35.2271, 'lng': -80.8431, 'base_price': 280000},
        'San Francisco': {'lat': 37.7749, 'lng': -122.4194, 'base_price': 1200000},
        'Indianapolis': {'lat': 39.7684, 'lng': -86.1581, 'base_price': 180000},
        'Seattle': {'lat': 47.6062, 'lng': -122.3321, 'base_price': 750000},
        'Denver': {'lat': 39.7392, 'lng': -104.9903, 'base_price': 450000},
        'Washington': {'lat': 38.9072, 'lng': -77.0369, 'base_price': 550000}
    }
    
    properties = []
    property_types = ['Apartment', 'House', 'Condo', 'Villa', 'Townhouse', 'Penthouse']
    listing_types = ['ForSale', 'ForRent', 'Booking']
    
    for city, coords in cities.items():
        # Generate 3-8 properties per city
        num_properties = random.randint(3, 8)
        
        for i in range(num_properties):
            # Add some randomness to coordinates
            lat = coords['lat'] + random.uniform(-0.05, 0.05)
            lng = coords['lng'] + random.uniform(-0.05, 0.05)
            
            property_type = random.choice(property_types)
            listing_type = random.choice(listing_types)
            
            # Base price varies by property type and listing type
            base_price = coords['base_price']
            if property_type == 'Villa':
                base_price *= 1.5
            elif property_type == 'Penthouse':
                base_price *= 2.0
            elif property_type == 'Condo':
                base_price *= 0.8
            
            # Adjust price based on listing type
            if listing_type == 'ForRent':
                price = base_price * 0.008 * random.uniform(0.8, 1.2)  # Monthly rent
            elif listing_type == 'Booking':
                price = base_price * 0.002 * random.uniform(0.8, 1.2)  # Daily rate
            else:  # ForSale
                price = base_price * random.uniform(0.8, 1.2)
            
            # Generate property features
            bedrooms = random.randint(1, 5)
            bathrooms = random.randint(1, 4)
            size = random.randint(800, 4000)
            
            # ML Score (simulated)
            ml_score = random.uniform(0.6, 0.95)
            
            # Property status
            status_options = ['Available', 'Under Contract', 'Sold', 'Rented', 'Reserved']
            status = random.choice(status_options)
            
            # Created date
            created_date = datetime.now() - timedelta(days=random.randint(1, 365))
            
            property_data = {
                'id': f"PROP_{city}_{i+1:03d}",
                'title': f"{property_type} in {city}",
                'property_type': property_type,
                'listing_type': listing_type,
                'status': status,
                'price': round(price, 2),
                'bedrooms': bedrooms,
                'bathrooms': bathrooms,
                'size': size,
                'ml_score': round(ml_score, 2),
                'city': city,
                'lat': lat,
                'lng': lng,
                'created_at': created_date,
                'description': f"Beautiful {property_type.lower()} with {bedrooms} bedrooms and {bathrooms} bathrooms in {city}."
            }
            
            properties.append(property_data)
    
    return pd.DataFrame(properties)

@st.cache_data
def load_property_data() -> pd.DataFrame:
    return generate_sample_properties()

def main():
    inject_global_css()
    st.set_page_config(page_title="Property Map Visualizer", page_icon="🏠", layout="wide", initial_sidebar_state="expanded")
    st.markdown('<h1 class="main-header">🏠 Property Map Visualizer</h1>', unsafe_allow_html=True)
    
    # Load data
    df = load_property_data()
    
    # Sidebar filters
    st.sidebar.header("📊 Filters & Controls")
    
    # Listing type filter
    selected_listing_types = st.sidebar.multiselect(
        "Listing Type",
        options=df['listing_type'].unique(),
        default=df['listing_type'].unique(),
        key="listing_type_filter"
    )
    
    # Property type filter
    selected_property_types = st.sidebar.multiselect(
        "Property Type",
        options=df['property_type'].unique(),
        default=df['property_type'].unique(),
        key="property_type_filter"
    )
    
    # Price range filter
    price_range = st.sidebar.slider(
        "Price Range",
        min_value=int(df['price'].min()),
        max_value=int(df['price'].max()),
        value=(int(df['price'].min()), int(df['price'].max())),
        key="price_range_filter"
    )
    
    # ML Score filter
    ml_score_range = st.sidebar.slider(
        "ML Score Range",
        min_value=float(df['ml_score'].min()),
        max_value=float(df['ml_score'].max()),
        value=(float(df['ml_score'].min()), float(df['ml_score'].max())),
        key="ml_score_range_filter"
    )
    
    # City filter
    selected_cities = st.sidebar.multiselect(
        "Cities",
        options=df['city'].unique(),
        default=df['city'].unique(),
        key="city_filter"
    )
    
    # Apply filters
    filtered_df = df[
        (df['listing_type'].isin(selected_listing_types)) &
        (df['property_type'].isin(selected_property_types)) &
        (df['price'] >= price_range[0]) &
        (df['price'] <= price_range[1]) &
        (df['ml_score'] >= ml_score_range[0]) &
        (df['ml_score'] <= ml_score_range[1]) &
        (df['city'].isin(selected_cities))
    ]
    
    # Main content metrics with card styling
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f'<div class="metric-card"><div style="font-size:1.2rem;">Total Properties</div><div style="font-size:2rem;font-weight:bold;">{len(filtered_df)}</div></div>', unsafe_allow_html=True)
    with col2:
        avg_price = filtered_df['price'].mean()
        st.markdown(f'<div class="metric-card"><div style="font-size:1.2rem;">Average Price</div><div style="font-size:2rem;font-weight:bold;">${avg_price:,.0f}</div></div>', unsafe_allow_html=True)
    with col3:
        avg_ml_score = filtered_df['ml_score'].mean()
        st.markdown(f'<div class="metric-card"><div style="font-size:1.2rem;">Avg ML Score</div><div style="font-size:2rem;font-weight:bold;">{avg_ml_score:.2f}</div></div>', unsafe_allow_html=True)
    with col4:
        total_value = filtered_df['price'].sum()
        st.markdown(f'<div class="metric-card"><div style="font-size:1.2rem;">Total Value</div><div style="font-size:2rem;font-weight:bold;">${total_value:,.0f}</div></div>', unsafe_allow_html=True)
    
    # Create tabs
    tab1, tab2, tab3, tab4 = st.tabs(["🗺️ Interactive Map", "📊 Analytics", "📈 Trends", "📋 Property Table"])
    
    with tab1:
        st.header("🗺️ Interactive Property Map")
        
        # Create Folium map
        m = folium.Map(
            location=[39.8283, -98.5795],  # Center of USA
            zoom_start=4,
            tiles='OpenStreetMap'
        )
        
        # Color mapping for listing types
        color_map = {
            'ForSale': 'red',
            'ForRent': 'blue',
            'Booking': 'green'
        }
        
        # Add markers for each property
        for idx, row in filtered_df.iterrows():
            # Create popup content
            popup_content = f"""
            <div style="width: 250px;">
                <h4>{row['title']}</h4>
                <p><strong>Type:</strong> {row['property_type']}</p>
                <p><strong>Listing:</strong> {row['listing_type']}</p>
                <p><strong>Price:</strong> ${row['price']:,.0f}</p>
                <p><strong>Bedrooms:</strong> {row['bedrooms']}</p>
                <p><strong>Bathrooms:</strong> {row['bathrooms']}</p>
                <p><strong>Size:</strong> {row['size']} sq ft</p>
                <p><strong>ML Score:</strong> {row['ml_score']:.2f}</p>
                <p><strong>Status:</strong> {row['status']}</p>
            </div>
            """
            
            folium.Marker(
                location=[row['lat'], row['lng']],
                popup=folium.Popup(popup_content, max_width=300),
                tooltip=f"{row['title']} - ${row['price']:,.0f}",
                icon=folium.Icon(color=color_map.get(row['listing_type'], 'gray'))
            ).add_to(m)
        
        # Display the map
        st_folium(m, width=800, height=600)
        
        # Map statistics
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.subheader("By Listing Type")
            listing_stats = filtered_df.groupby('listing_type').agg({
                'price': ['count', 'mean', 'sum'],
                'ml_score': 'mean'
            }).round(2)
            st.dataframe(listing_stats)
        
        with col2:
            st.subheader("By Property Type")
            property_stats = filtered_df.groupby('property_type').agg({
                'price': ['count', 'mean'],
                'ml_score': 'mean'
            }).round(2)
            st.dataframe(property_stats)
        
        with col3:
            st.subheader("By City")
            city_stats = filtered_df.groupby('city').agg({
                'price': ['count', 'mean'],
                'ml_score': 'mean'
            }).round(2)
            st.dataframe(city_stats)
    
    with tab2:
        st.header("📊 Property Analytics")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Price distribution by listing type
            fig_price = px.histogram(
                filtered_df,
                x='price',
                color='listing_type',
                title='Price Distribution by Listing Type',
                labels={'price': 'Price ($)', 'listing_type': 'Listing Type'},
                color_discrete_map=color_map
            )
            st.plotly_chart(fig_price, use_container_width=True)
            
            # ML Score vs Price scatter
            fig_scatter = px.scatter(
                filtered_df,
                x='price',
                y='ml_score',
                color='listing_type',
                size='size',
                hover_data=['title', 'city'],
                title='ML Score vs Price',
                labels={'price': 'Price ($)', 'ml_score': 'ML Score'},
                color_discrete_map=color_map
            )
            st.plotly_chart(fig_scatter, use_container_width=True)
        
        with col2:
            # Property type distribution
            fig_property = px.pie(
                filtered_df,
                names='property_type',
                title='Property Type Distribution'
            )
            st.plotly_chart(fig_property, use_container_width=True)
            
            # City distribution
            fig_city = px.bar(
                filtered_df.groupby('city').size().reset_index(name='count'),
                x='city',
                y='count',
                title='Properties by City'
            )
            fig_city.update_xaxes(tickangle=45)
            st.plotly_chart(fig_city, use_container_width=True)
    
    with tab3:
        st.header("📈 Market Trends")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Average price by listing type over time
            df_time = filtered_df.copy()
            df_time['month'] = df_time['created_at'].dt.to_period('M')
            
            monthly_avg = df_time.groupby(['month', 'listing_type'])['price'].mean().reset_index()
            monthly_avg['month'] = monthly_avg['month'].astype(str)
            
            fig_trend = px.line(
                monthly_avg,
                x='month',
                y='price',
                color='listing_type',
                title='Average Price Trends by Listing Type',
                labels={'price': 'Average Price ($)', 'month': 'Month'},
                color_discrete_map=color_map
            )
            st.plotly_chart(fig_trend, use_container_width=True)
        
        with col2:
            # ML Score trends
            monthly_ml = df_time.groupby(['month', 'listing_type'])['ml_score'].mean().reset_index()
            monthly_ml['month'] = monthly_ml['month'].astype(str)
            
            fig_ml_trend = px.line(
                monthly_ml,
                x='month',
                y='ml_score',
                color='listing_type',
                title='ML Score Trends by Listing Type',
                labels={'ml_score': 'Average ML Score', 'month': 'Month'},
                color_discrete_map=color_map
            )
            st.plotly_chart(fig_ml_trend, use_container_width=True)
    
    with tab4:
        st.header("📋 Property Details Table")
        
        # Add download button
        csv = filtered_df.to_csv(index=False)
        st.download_button(
            label="Download CSV",
            data=csv,
            file_name="property_data.csv",
            mime="text/csv"
        )
        
        # Display the table with formatting
        st.dataframe(
            filtered_df[[
                'title', 'property_type', 'listing_type', 'price', 
                'bedrooms', 'bathrooms', 'size', 'ml_score', 'city', 'status'
            ]].style.format({
                'price': '${:,.0f}',
                'ml_score': '{:.2f}',
                'size': '{:,.0f}'
            }),
            use_container_width=True
        )

if __name__ == "__main__":
    main() 