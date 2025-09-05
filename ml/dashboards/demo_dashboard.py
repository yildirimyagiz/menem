import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from datetime import datetime, timedelta
import random

st.set_page_config(
    page_title="ML Analytics Dashboard",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .dashboard-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 0.5rem 0;
    }
    .chart-container {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div class="dashboard-header">
    <h1>📊 ML Analytics Dashboard</h1>
    <p>Real-time property analysis insights and performance metrics</p>
</div>
""", unsafe_allow_html=True)

# Generate sample data
@st.cache_data
def generate_sample_data():
    """Generate realistic sample data for the dashboard"""
    
    # Sample property types and their characteristics
    property_types = {
        'apartment': {'avg_score': 0.85, 'common_tags': ['interior', 'modern', 'kitchen', 'bedroom']},
        'house': {'avg_score': 0.78, 'common_tags': ['exterior', 'garden', 'living room', 'dining room']},
        'condo': {'avg_score': 0.82, 'common_tags': ['interior', 'balcony', 'modern', 'kitchen']},
        'villa': {'avg_score': 0.91, 'common_tags': ['exterior', 'garden', 'pool', 'luxury']},
        'studio': {'avg_score': 0.76, 'common_tags': ['interior', 'compact', 'modern', 'efficient']}
    }
    
    # Generate 100 sample analyses
    data = []
    dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
    
    for i in range(100):
        prop_type = random.choice(list(property_types.keys()))
        base_score = property_types[prop_type]['avg_score']
        score = np.random.normal(base_score, 0.1)
        score = max(0.1, min(1.0, score))
        
        # Generate tags
        common_tags = property_types[prop_type]['common_tags']
        num_tags = random.randint(2, 5)
        tags = random.sample(common_tags, min(num_tags, len(common_tags)))
        
        # Add some random additional tags
        additional_tags = ['bathroom', 'office', 'laundry', 'storage', 'parking']
        if random.random() < 0.3:
            tags.extend(random.sample(additional_tags, random.randint(1, 2)))
        
        data.append({
            'id': i + 1,
            'date': random.choice(dates),
            'property_type': prop_type,
            'score': round(score, 3),
            'tags': tags,
            'analysis_time': random.randint(1, 10),
            'image_quality': random.choice(['high', 'medium', 'low']),
            'region': random.choice(['North', 'South', 'East', 'West', 'Central']),
            'price_range': random.choice(['budget', 'mid-range', 'luxury']),
            'condition': random.choice(['excellent', 'good', 'fair', 'needs work']),
            'style': random.choice(['modern', 'traditional', 'contemporary', 'vintage'])
        })
    
    return pd.DataFrame(data)

# Load sample data
df = generate_sample_data()

# Sidebar filters
with st.sidebar:
    st.header("🔍 Filters")
    
    # Date range filter
    date_range = st.date_input(
        "Date Range",
        value=(df['date'].min(), df['date'].max()),
        min_value=df['date'].min(),
        max_value=df['date'].max()
    )
    
    # Property type filter
    selected_types = st.multiselect(
        "Property Types",
        options=df['property_type'].unique(),
        default=df['property_type'].unique()
    )
    
    # Score range filter
    score_range = st.slider(
        "Score Range",
        min_value=float(df['score'].min()),
        max_value=float(df['score'].max()),
        value=(float(df['score'].min()), float(df['score'].max())),
        step=0.01
    )
    
    # Region filter
    selected_regions = st.multiselect(
        "Regions",
        options=df['region'].unique(),
        default=df['region'].unique()
    )

# Apply filters
mask = (
    (df['date'].dt.date >= date_range[0]) &
    (df['date'].dt.date <= date_range[1]) &
    (df['property_type'].isin(selected_types)) &
    (df['score'] >= score_range[0]) &
    (df['score'] <= score_range[1]) &
    (df['region'].isin(selected_regions))
)
filtered_df = df[mask]

# Main dashboard content
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.metric(
        "Total Analyses",
        len(filtered_df),
        delta=f"{len(filtered_df) - len(df)} from total"
    )
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    avg_score = filtered_df['score'].mean()
    st.metric(
        "Average Score",
        f"{avg_score:.3f}",
        delta=f"{avg_score - df['score'].mean():.3f}"
    )
    st.markdown('</div>', unsafe_allow_html=True)

with col3:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.metric(
        "Analysis Time",
        f"{filtered_df['analysis_time'].mean():.1f}s avg",
        delta=f"{filtered_df['analysis_time'].mean() - df['analysis_time'].mean():.1f}s"
    )
    st.markdown('</div>', unsafe_allow_html=True)

with col4:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.metric(
        "Success Rate",
        f"{(filtered_df['score'] > 0.7).mean() * 100:.1f}%",
        delta=f"{(filtered_df['score'] > 0.7).mean() - (df['score'] > 0.7).mean():.1%}"
    )
    st.markdown('</div>', unsafe_allow_html=True)

# Charts section
st.markdown("---")
st.subheader("📈 Analytics Charts")

# Create two columns for charts
chart_col1, chart_col2 = st.columns(2)

with chart_col1:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.subheader("Score Distribution")
    
    fig = px.histogram(
        filtered_df,
        x='score',
        nbins=20,
        color='property_type',
        title="Analysis Score Distribution by Property Type",
        labels={'score': 'Confidence Score', 'count': 'Number of Analyses'}
    )
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

with chart_col2:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.subheader("Property Type Performance")
    
    type_performance = filtered_df.groupby('property_type').agg({
        'score': ['mean', 'count'],
        'analysis_time': 'mean'
    }).round(3)
    
    fig = px.bar(
        x=type_performance.index,
        y=type_performance[('score', 'mean')],
        title="Average Score by Property Type",
        labels={'x': 'Property Type', 'y': 'Average Score'}
    )
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

# Time series and trends
st.markdown("---")
st.subheader("📅 Time Series Analysis")

time_col1, time_col2 = st.columns(2)

with time_col1:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.subheader("Daily Analysis Volume")
    
    daily_counts = filtered_df.groupby(filtered_df['date'].dt.date).size().reset_index(name='count')
    fig = px.line(
        daily_counts,
        x='date',
        y='count',
        title="Daily Analysis Volume",
        labels={'date': 'Date', 'count': 'Number of Analyses'}
    )
    fig.update_layout(height=300)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

with time_col2:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.subheader("Score Trends Over Time")
    
    daily_scores = filtered_df.groupby(filtered_df['date'].dt.date)['score'].mean().reset_index()
    fig = px.line(
        daily_scores,
        x='date',
        y='score',
        title="Average Score Over Time",
        labels={'date': 'Date', 'score': 'Average Score'}
    )
    fig.update_layout(height=300)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

# Tag analysis
st.markdown("---")
st.subheader("🏷️ Tag Analysis")

# Flatten tags for analysis
all_tags = []
for tags in filtered_df['tags']:
    all_tags.extend(tags)

if all_tags:
    tag_counts = pd.Series(all_tags).value_counts().head(15)
    
    tag_col1, tag_col2 = st.columns(2)
    
    with tag_col1:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        st.subheader("Most Common Tags")
        
        fig = px.bar(
            x=tag_counts.values,
            y=tag_counts.index,
            orientation='h',
            title="Top 15 Most Common Property Tags",
            labels={'x': 'Frequency', 'y': 'Tags'}
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with tag_col2:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        st.subheader("Tag Cloud Data")
        
        # Create a simple tag cloud representation
        tag_data = pd.DataFrame({
            'tag': tag_counts.index,
            'count': tag_counts.values,
            'size': tag_counts.values * 10  # For visualization
        })
        
        st.dataframe(
            tag_data.head(10),
            use_container_width=True,
            hide_index=True
        )
        st.markdown('</div>', unsafe_allow_html=True)

# Regional analysis
st.markdown("---")
st.subheader("🗺️ Regional Analysis")

region_col1, region_col2 = st.columns(2)

with region_col1:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.subheader("Regional Performance")
    
    regional_stats = filtered_df.groupby('region').agg({
        'score': 'mean',
        'analysis_time': 'mean',
        'id': 'count'
    }).round(3)
    
    fig = px.bar(
        x=regional_stats.index,
        y=regional_stats['score'],
        title="Average Score by Region",
        labels={'x': 'Region', 'y': 'Average Score'}
    )
    fig.update_layout(height=300)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

with region_col2:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.subheader("Regional Activity")
    
    fig = px.pie(
        values=filtered_df['region'].value_counts().values,
        names=filtered_df['region'].value_counts().index,
        title="Analysis Distribution by Region"
    )
    fig.update_layout(height=300)
    st.plotly_chart(fig, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown("---")
st.caption("""
<div style='text-align: center; color: #666;'>
    📊 ML Analytics Dashboard | Powered by Streamlit & Plotly | 
    <a href='#' target='_blank'>Documentation</a> | 
    <a href='#' target='_blank'>GitHub</a>
</div>
""", unsafe_allow_html=True) 