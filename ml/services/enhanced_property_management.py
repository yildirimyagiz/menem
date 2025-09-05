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
    from trubrics import Trubrics
    from st_chat_message import message
    from streamlit_awesome_table import st_awesome_table
except ImportError as e:
    st.error(f"Missing package: {e}")
    st.info("Please install required packages: pip install trubrics st-chat-message streamlit-awesome-table")

# Set page config
st.set_page_config(
    page_title="Enhanced Property Management",
    page_icon="🏢",
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
    .management-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 1rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .feedback-section {
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
        max-height: 400px;
        overflow-y: auto;
    }
    .table-container {
        background: white;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# Generate comprehensive property management data
def generate_management_data():
    """Generate comprehensive property management data"""
    np.random.seed(42)
    random.seed(42)
    
    # Property types and management characteristics
    property_types = {
        'Apartment': {'base_rent': 2000, 'maintenance_cost': 300, 'occupancy_rate': 0.85},
        'House': {'base_rent': 3500, 'maintenance_cost': 500, 'occupancy_rate': 0.90},
        'Condo': {'base_rent': 2800, 'maintenance_cost': 400, 'occupancy_rate': 0.88},
        'Villa': {'base_rent': 5000, 'maintenance_cost': 800, 'occupancy_rate': 0.75},
        'Penthouse': {'base_rent': 8000, 'maintenance_cost': 1200, 'occupancy_rate': 0.70},
        'Townhouse': {'base_rent': 4000, 'maintenance_cost': 600, 'occupancy_rate': 0.82},
        'Studio': {'base_rent': 1500, 'maintenance_cost': 200, 'occupancy_rate': 0.92},
        'Loft': {'base_rent': 3200, 'maintenance_cost': 450, 'occupancy_rate': 0.80}
    }
    
    # Cities and market characteristics
    cities = {
        'New York': {'demand': 0.95, 'competition': 0.9, 'regulations': 'High'},
        'Los Angeles': {'demand': 0.88, 'competition': 0.8, 'regulations': 'Medium'},
        'Chicago': {'demand': 0.75, 'competition': 0.7, 'regulations': 'Medium'},
        'Miami': {'demand': 0.82, 'competition': 0.75, 'regulations': 'Low'},
        'San Francisco': {'demand': 0.92, 'competition': 0.85, 'regulations': 'High'},
        'Austin': {'demand': 0.78, 'competition': 0.65, 'regulations': 'Low'},
        'Seattle': {'demand': 0.85, 'competition': 0.8, 'regulations': 'Medium'},
        'Denver': {'demand': 0.80, 'competition': 0.7, 'regulations': 'Medium'}
    }
    
    properties = []
    
    for prop_type, specs in property_types.items():
        for i in range(12):  # 12 properties per type
            city = random.choice(list(cities.keys()))
            city_specs = cities[city]
            
            # Calculate management metrics
            base_rent = specs['base_rent'] * (1 + random.uniform(-0.1, 0.2))
            maintenance_cost = specs['maintenance_cost'] * random.uniform(0.8, 1.3)
            occupancy_rate = specs['occupancy_rate'] * random.uniform(0.9, 1.1)
            
            # Revenue and profit calculations
            monthly_revenue = base_rent * occupancy_rate
            monthly_expenses = maintenance_cost + (base_rent * 0.1)  # 10% management fee
            monthly_profit = monthly_revenue - monthly_expenses
            
            # Property status
            status_options = ['Available', 'Occupied', 'Under Maintenance', 'Reserved']
            status_weights = [0.15, 0.65, 0.15, 0.05]
            status = random.choices(status_options, weights=status_weights)[0]
            
            # Tenant information
            tenant_info = {
                'name': f"Tenant {i+1}",
                'lease_start': datetime.now() - timedelta(days=random.randint(30, 365)),
                'lease_end': datetime.now() + timedelta(days=random.randint(30, 730)),
                'payment_status': random.choice(['Paid', 'Pending', 'Overdue']),
                'rating': round(random.uniform(3.5, 5.0), 1)
            }
            
            # Property features
            all_features = ['Pool', 'Gym', 'Parking', 'Security', 'Balcony', 'Fireplace', 'Hardwood Floors', 'Central AC', 'Walk-in Closet', 'Garden']
            features = random.sample(all_features, random.randint(3, 7))
            
            properties.append({
                'id': f"{prop_type}_{i+1}",
                'type': prop_type,
                'city': city,
                'address': f"{random.randint(100, 9999)} {random.choice(['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd'])}",
                'status': status,
                'monthly_rent': round(base_rent, 2),
                'monthly_revenue': round(monthly_revenue, 2),
                'monthly_expenses': round(monthly_expenses, 2),
                'monthly_profit': round(monthly_profit, 2),
                'occupancy_rate': round(occupancy_rate, 3),
                'maintenance_cost': round(maintenance_cost, 2),
                'tenant_name': tenant_info['name'],
                'lease_start': tenant_info['lease_start'].strftime('%Y-%m-%d'),
                'lease_end': tenant_info['lease_end'].strftime('%Y-%m-%d'),
                'payment_status': tenant_info['payment_status'],
                'tenant_rating': tenant_info['rating'],
                'features': features,
                'demand_score': round(city_specs['demand'], 2),
                'competition_level': round(city_specs['competition'], 2),
                'regulations': city_specs['regulations'],
                'last_maintenance': (datetime.now() - timedelta(days=random.randint(0, 180))).strftime('%Y-%m-%d'),
                'next_maintenance': (datetime.now() + timedelta(days=random.randint(30, 365))).strftime('%Y-%m-%d')
            })
    
    return pd.DataFrame(properties)

# Chat functionality
def initialize_chat():
    """Initialize chat session"""
    if "management_messages" not in st.session_state:
        st.session_state.management_messages = [
            {"role": "assistant", "content": "Hello! I'm your property management assistant. I can help you with tenant management, financial analysis, maintenance scheduling, and property insights. What would you like to know?"}
        ]

def add_message(role, content):
    """Add a message to the chat"""
    st.session_state.management_messages.append({"role": role, "content": content})

def get_management_response(user_input):
    """Generate management response based on user input"""
    responses = {
        "tenant": "I can help you with tenant management! Check the tenant information in the table and use the feedback system to rate your experience.",
        "financial": "Let me show you the financial analysis. The dashboard displays revenue, expenses, and profit metrics for all properties.",
        "maintenance": "Maintenance scheduling is available in the management section. You can track upcoming maintenance and costs.",
        "property": "Property insights are available in the analytics section. I can show you occupancy rates, demand scores, and market trends.",
        "feedback": "Use the Trubrics feedback system to provide ratings and comments about the property management experience."
    }
    
    user_input_lower = user_input.lower()
    
    for key, response in responses.items():
        if key in user_input_lower:
            return response
    
    return "I understand you're interested in property management. I can help you with tenant management, financial analysis, maintenance scheduling, property insights, and feedback collection. What specific aspect would you like to explore?"

def main():
    inject_global_css()
    st.set_page_config(page_title="Enhanced Property Management", page_icon="🏢", layout="wide", initial_sidebar_state="expanded")
    st.markdown('<h1 class="main-header">🏢 Enhanced Property Management</h1>', unsafe_allow_html=True)
    
    # Initialize chat
    initialize_chat()
    
    # Generate data
    df = generate_management_data()
    
    # Sidebar
    st.sidebar.header("🔧 Management Tools")
    
    management_mode = st.sidebar.selectbox(
        "Select Management Mode",
        ["Dashboard Overview", "Tenant Management", "Financial Analysis", "Maintenance Tracking", "Feedback System", "AI Assistant"]
    )
    
    # Main content based on selected mode
    if management_mode == "Dashboard Overview":
        st.header("📊 Property Management Dashboard")
        
        # Key metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            total_revenue = df['monthly_revenue'].sum()
            st.metric("Total Monthly Revenue", f"${total_revenue:,.0f}")
        
        with col2:
            total_profit = df['monthly_profit'].sum()
            st.metric("Total Monthly Profit", f"${total_profit:,.0f}")
        
        with col3:
            avg_occupancy = df['occupancy_rate'].mean()
            st.metric("Average Occupancy Rate", f"{avg_occupancy:.1%}")
        
        with col4:
            occupied_properties = len(df[df['status'] == 'Occupied'])
            total_properties = len(df)
            st.metric("Occupied Properties", f"{occupied_properties}/{total_properties}")
        
        # Property status distribution
        col1, col2 = st.columns(2)
        
        with col1:
            fig_status = px.pie(
                df,
                names='status',
                title='Property Status Distribution'
            )
            st.plotly_chart(fig_status, use_container_width=True)
        
        with col2:
            fig_profit = px.histogram(
                df,
                x='monthly_profit',
                color='type',
                title='Monthly Profit Distribution by Property Type'
            )
            st.plotly_chart(fig_profit, use_container_width=True)
        
        # Awesome table
        st.subheader("📋 Property Management Overview")
        
        try:
            # Prepare data for awesome table
            table_data = df[['id', 'type', 'city', 'status', 'monthly_rent', 'monthly_profit', 'occupancy_rate', 'tenant_name', 'payment_status']].copy()
            table_data.columns = ['ID', 'Type', 'City', 'Status', 'Monthly Rent', 'Monthly Profit', 'Occupancy Rate', 'Tenant', 'Payment Status']
            
            st_awesome_table(
                table_data,
                key="property_table",
                theme="streamlit",
                use_checkbox=True,
                use_filters=True,
                use_pagination=True,
                pagination_options={
                    "rows_per_page": 10,
                    "rows_per_page_options": [5, 10, 20, 50]
                }
            )
            
        except Exception as e:
            st.error(f"Awesome table error: {e}")
            st.info("Please ensure streamlit-awesome-table is installed")
            
            # Fallback to regular dataframe
            st.dataframe(df[['id', 'type', 'city', 'status', 'monthly_rent', 'monthly_profit', 'occupancy_rate', 'tenant_name', 'payment_status']], use_container_width=True)
    
    elif management_mode == "Tenant Management":
        st.header("👥 Tenant Management")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Tenant Information")
            
            # Filter by tenant status
            tenant_status = st.selectbox("Filter by Payment Status", ['All'] + df['payment_status'].unique().tolist())
            
            if tenant_status != 'All':
                tenant_df = df[df['payment_status'] == tenant_status]
            else:
                tenant_df = df
            
            # Tenant table
            tenant_data = tenant_df[['tenant_name', 'type', 'city', 'monthly_rent', 'payment_status', 'tenant_rating', 'lease_start', 'lease_end']].copy()
            tenant_data.columns = ['Tenant Name', 'Property Type', 'City', 'Monthly Rent', 'Payment Status', 'Rating', 'Lease Start', 'Lease End']
            
            try:
                st_awesome_table(
                    tenant_data,
                    key="tenant_table",
                    theme="streamlit",
                    use_checkbox=True,
                    use_filters=True,
                    use_pagination=True
                )
            except Exception as e:
                st.dataframe(tenant_data, use_container_width=True)
        
        with col2:
            st.subheader("Tenant Analytics")
            
            # Payment status distribution
            payment_counts = df['payment_status'].value_counts()
            fig_payment = px.pie(
                values=payment_counts.values,
                names=payment_counts.index,
                title='Payment Status Distribution'
            )
            st.plotly_chart(fig_payment, use_container_width=True)
            
            # Average tenant rating
            avg_rating = df['tenant_rating'].mean()
            st.metric("Average Tenant Rating", f"{avg_rating:.1f}/5.0")
            
            # Overdue payments
            overdue_count = len(df[df['payment_status'] == 'Overdue'])
            st.metric("Overdue Payments", overdue_count)
    
    elif management_mode == "Financial Analysis":
        st.header("💰 Financial Analysis")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Revenue Analysis")
            
            # Revenue by property type
            revenue_by_type = df.groupby('type')['monthly_revenue'].sum().sort_values(ascending=False)
            fig_revenue = px.bar(
                x=revenue_by_type.index,
                y=revenue_by_type.values,
                title='Monthly Revenue by Property Type'
            )
            st.plotly_chart(fig_revenue, use_container_width=True)
            
            # Profit margin analysis
            df['profit_margin'] = (df['monthly_profit'] / df['monthly_revenue']) * 100
            avg_margin = df['profit_margin'].mean()
            st.metric("Average Profit Margin", f"{avg_margin:.1f}%")
        
        with col2:
            st.subheader("Expense Analysis")
            
            # Expenses by property type
            expenses_by_type = df.groupby('type')['monthly_expenses'].sum().sort_values(ascending=False)
            fig_expenses = px.bar(
                x=expenses_by_type.index,
                y=expenses_by_type.values,
                title='Monthly Expenses by Property Type'
            )
            st.plotly_chart(fig_expenses, use_container_width=True)
            
            # Maintenance cost analysis
            total_maintenance = df['maintenance_cost'].sum()
            st.metric("Total Monthly Maintenance", f"${total_maintenance:,.0f}")
        
        # Financial summary table
        st.subheader("📊 Financial Summary")
        
        financial_summary = df.groupby('type').agg({
            'monthly_revenue': 'sum',
            'monthly_expenses': 'sum',
            'monthly_profit': 'sum',
            'maintenance_cost': 'sum'
        }).round(2)
        
        financial_summary.columns = ['Total Revenue', 'Total Expenses', 'Total Profit', 'Maintenance Cost']
        
        try:
            st_awesome_table(
                financial_summary.reset_index(),
                key="financial_table",
                theme="streamlit",
                use_filters=True
            )
        except Exception as e:
            st.dataframe(financial_summary, use_container_width=True)
    
    elif management_mode == "Maintenance Tracking":
        st.header("🔧 Maintenance Tracking")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Maintenance Schedule")
            
            # Filter by maintenance status
            maintenance_filter = st.selectbox("Filter by Status", ['All', 'Due Soon', 'Recently Completed', 'Overdue'])
            
            # Calculate maintenance status
            df['days_since_maintenance'] = (datetime.now() - pd.to_datetime(df['last_maintenance'])).dt.days
            df['days_until_maintenance'] = (pd.to_datetime(df['next_maintenance']) - datetime.now()).dt.days
            
            if maintenance_filter == 'Due Soon':
                maintenance_df = df[df['days_until_maintenance'].between(0, 30)]
            elif maintenance_filter == 'Recently Completed':
                maintenance_df = df[df['days_since_maintenance'].between(0, 30)]
            elif maintenance_filter == 'Overdue':
                maintenance_df = df[df['days_until_maintenance'] < 0]
            else:
                maintenance_df = df
            
            # Maintenance table
            maintenance_data = maintenance_df[['id', 'type', 'city', 'last_maintenance', 'next_maintenance', 'maintenance_cost', 'days_until_maintenance']].copy()
            maintenance_data.columns = ['Property ID', 'Type', 'City', 'Last Maintenance', 'Next Maintenance', 'Monthly Cost', 'Days Until Due']
            
            try:
                st_awesome_table(
                    maintenance_data,
                    key="maintenance_table",
                    theme="streamlit",
                    use_filters=True,
                    use_pagination=True
                )
            except Exception as e:
                st.dataframe(maintenance_data, use_container_width=True)
        
        with col2:
            st.subheader("Maintenance Analytics")
            
            # Maintenance cost by property type
            maintenance_by_type = df.groupby('type')['maintenance_cost'].mean().sort_values(ascending=False)
            fig_maintenance = px.bar(
                x=maintenance_by_type.index,
                y=maintenance_by_type.values,
                title='Average Monthly Maintenance Cost by Property Type'
            )
            st.plotly_chart(fig_maintenance, use_container_width=True)
            
            # Upcoming maintenance
            upcoming_count = len(df[df['days_until_maintenance'].between(0, 30)])
            st.metric("Upcoming Maintenance (30 days)", upcoming_count)
            
            # Overdue maintenance
            overdue_count = len(df[df['days_until_maintenance'] < 0])
            st.metric("Overdue Maintenance", overdue_count)
    
    elif management_mode == "Feedback System":
        st.header("📝 Feedback System")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Property Management Feedback")
            
            try:
                # Trubrics feedback system
                feedback = st_feedback(
                    component="property_management",
                    feedback_type="thumbs",
                    text="How was your property management experience?",
                    key="management_feedback"
                )
                
                if feedback:
                    st.success(f"Thank you for your feedback! Rating: {feedback['score']}")
                    
                    # Additional feedback form
                    with st.form("detailed_feedback"):
                        st.text_area("Additional Comments", placeholder="Please share your detailed feedback...")
                        feedback_category = st.selectbox("Feedback Category", ["General", "Tenant Management", "Maintenance", "Financial", "Communication"])
                        rating = st.slider("Overall Rating", 1, 5, 3)
                        
                        if st.form_submit_button("Submit Feedback"):
                            st.success("Detailed feedback submitted successfully!")
                            
            except Exception as e:
                st.error(f"Feedback system error: {e}")
                st.info("Please ensure trubrics is installed")
                
                # Fallback feedback
                st.subheader("Alternative Feedback")
                rating = st.slider("Rate your experience", 1, 5, 3)
                comments = st.text_area("Comments")
                if st.button("Submit"):
                    st.success("Feedback submitted!")
        
        with col2:
            st.subheader("Feedback Analytics")
            
            # Simulate feedback data
            feedback_data = {
                'Category': ['General', 'Tenant Management', 'Maintenance', 'Financial', 'Communication'],
                'Average Rating': [4.2, 4.5, 3.8, 4.0, 4.3],
                'Response Count': [45, 38, 52, 29, 41]
            }
            
            feedback_df = pd.DataFrame(feedback_data)
            
            fig_feedback = px.bar(
                feedback_df,
                x='Category',
                y='Average Rating',
                title='Average Feedback Ratings by Category'
            )
            st.plotly_chart(fig_feedback, use_container_width=True)
            
            st.metric("Total Feedback Responses", feedback_df['Response Count'].sum())
            st.metric("Average Overall Rating", f"{feedback_df['Average Rating'].mean():.1f}/5.0")
    
    elif management_mode == "AI Assistant":
        st.header("🤖 AI Property Management Assistant")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader("Chat with AI Assistant")
            
            try:
                # Chat interface with st-chat-message
                for message_data in st.session_state.management_messages:
                    if message_data["role"] == "assistant":
                        message(message_data["content"], is_user=False, key=f"assistant_{len(st.session_state.management_messages)}")
                    else:
                        message(message_data["content"], is_user=True, key=f"user_{len(st.session_state.management_messages)}")
                
                # Chat input
                if prompt := st.chat_input("Ask about property management..."):
                    add_message("user", prompt)
                    
                    # Generate AI response
                    ai_response = get_management_response(prompt)
                    add_message("assistant", ai_response)
                    
                    st.rerun()
                    
            except Exception as e:
                st.error(f"Chat error: {e}")
                st.info("Please ensure st-chat-message is installed")
                
                # Fallback chat
                st.subheader("Alternative Chat Interface")
                user_input = st.text_input("Ask about property management...")
                if user_input:
                    response = get_management_response(user_input)
                    st.write(f"**AI Assistant:** {response}")
        
        with col2:
            st.subheader("Quick Actions")
            
            if st.button("📊 Generate Financial Report"):
                st.info("Financial report generated and sent to your email.")
            
            if st.button("🔧 Schedule Maintenance"):
                st.info("Maintenance scheduling system opened.")
            
            if st.button("👥 Contact Tenants"):
                st.info("Tenant communication portal opened.")
            
            if st.button("📈 View Analytics"):
                st.info("Advanced analytics dashboard opened.")
            
            st.subheader("AI Insights")
            
            # Property insights
            best_performing = df.loc[df['monthly_profit'].idxmax()]
            st.metric("Best Performing Property", f"{best_performing['type']} - ${best_performing['monthly_profit']:,.0f}")
            
            avg_occupancy = df['occupancy_rate'].mean()
            st.metric("Portfolio Occupancy", f"{avg_occupancy:.1%}")
            
            total_profit = df['monthly_profit'].sum()
            st.metric("Total Monthly Profit", f"${total_profit:,.0f}")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666;">
        <p>🏢 Enhanced Property Management - Powered by AI/ML Technologies</p>
        <p>Features: Dashboard Overview • Tenant Management • Financial Analysis • Maintenance Tracking • Feedback System • AI Assistant</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main() 