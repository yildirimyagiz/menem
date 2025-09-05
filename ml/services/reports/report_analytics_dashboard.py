import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
import random
from datetime import datetime, timedelta
import requests
from typing import List, Dict, Any

# --- Live Data Fetching ---
@st.cache_data(ttl=60)
def fetch_reports():
    try:
        url = "http://localhost:2998/api/reports"
        headers = {"Authorization": f"Bearer {st.session_state.get('jwt_token', '')}"}
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        return pd.DataFrame(response.json()["data"])
    except Exception as e:
        st.warning(f"API fetch failed, using simulated data. ({e})")
        return generate_report_data()

@st.cache_data(ttl=60)
def fetch_scheduled_reports():
    try:
        url = "http://localhost:2998/api/reports/scheduled"
        headers = {"Authorization": f"Bearer {st.session_state.get('jwt_token', '')}"}
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        return pd.DataFrame(response.json()["data"])
    except Exception as e:
        st.warning(f"API fetch failed, using simulated scheduled reports. ({e})")
        return pd.DataFrame(simulated_scheduled_reports())

# --- Simulated Data (fallback) ---
def generate_report_data():
    np.random.seed(42)
    random.seed(42)
    reports = []
    for i in range(100):
        start_date = datetime.now() - timedelta(days=random.randint(0, 365))
        end_date = start_date + timedelta(days=random.randint(1, 30))
        report_type = random.choice(["FINANCIAL", "OCCUPANCY", "PERFORMANCE", "ANALYTICS", "CUSTOM"])
        status = random.choice(["GENERATED", "PENDING", "FAILED", "PROCESSING"])
        total_revenue = random.uniform(10000, 1000000)
        total_bookings = random.randint(10, 500)
        average_price = total_revenue / total_bookings if total_bookings > 0 else 0
        occupancy_rate = random.uniform(0.6, 0.95)
        total_reservations = random.randint(50, 1000)
        cancelled_reservations = random.randint(0, int(total_reservations * 0.2))
        completed_reservations = total_reservations - cancelled_reservations
        average_reservation_length = random.uniform(2, 14)
        total_paid_reservations = int(completed_reservations * random.uniform(0.8, 0.98))
        total_unpaid_reservations = completed_reservations - total_paid_reservations
        entities = ["Agency", "Property", "Facility", "Tenant", "Agent"]
        entity_type = random.choice(entities)
        entity_id = f"{entity_type.lower()}_{random.randint(1, 100)}"
        file_url = f"https://reports.example.com/reports/{random.randint(1000, 9999)}.pdf" if status == "GENERATED" else None
        reports.append({
            'id': f"report_{i+1}",
            'title': f"{report_type} - {start_date.strftime('%B %Y')}",
            'reportType': report_type,
            'status': status,
            'startDate': start_date,
            'endDate': end_date,
            'entityId': entity_id,
            'entityType': entity_type,
            'totalRevenue': round(total_revenue, 2),
            'totalBookings': total_bookings,
            'averagePrice': round(average_price, 2),
            'occupancyRate': round(occupancy_rate * 100, 1),
            'fileUrl': file_url,
            'description': f"Comprehensive {report_type.lower()} for {start_date.strftime('%B %Y')}",
            'totalReservations': total_reservations,
            'cancelledReservations': cancelled_reservations,
            'completedReservations': completed_reservations,
            'averageReservationLength': round(average_reservation_length, 1),
            'totalPaidReservations': total_paid_reservations,
            'totalUnpaidReservations': total_unpaid_reservations,
            'createdAt': start_date - timedelta(days=random.randint(1, 30)),
            'updatedAt': start_date,
            'generatedById': f"user_{random.randint(1, 50)}",
            'agencyId': f"agency_{random.randint(1, 20)}" if random.random() > 0.3 else None,
            'propertyId': f"property_{random.randint(1, 100)}" if random.random() > 0.4 else None,
            'tenantId': f"tenant_{random.randint(1, 200)}" if random.random() > 0.5 else None,
            'agentId': f"agent_{random.randint(1, 50)}" if random.random() > 0.6 else None,
            'facilityId': f"facility_{random.randint(1, 30)}" if random.random() > 0.7 else None,
            'includedServiceId': f"service_{random.randint(1, 40)}" if random.random() > 0.8 else None,
            'extraChargeId': f"charge_{random.randint(1, 25)}" if random.random() > 0.8 else None,
            'providerId': f"provider_{random.randint(1, 15)}" if random.random() > 0.8 else None,
        })
    return pd.DataFrame(reports)

def simulated_scheduled_reports():
    return [
        {'id': 'schedule_1', 'title': 'Monthly Financial Report', 'reportType': 'FINANCIAL', 'frequency': 'monthly', 'nextRun': '2024-02-01', 'isActive': True},
        {'id': 'schedule_2', 'title': 'Weekly Occupancy Report', 'reportType': 'OCCUPANCY', 'frequency': 'weekly', 'nextRun': '2024-01-29', 'isActive': True},
        {'id': 'schedule_3', 'title': 'Quarterly Performance Report', 'reportType': 'PERFORMANCE', 'frequency': 'quarterly', 'nextRun': '2024-04-01', 'isActive': False},
    ]

# --- UI/UX: Tabs for Sections ---
st.set_page_config(page_title="Report Analytics Dashboard", page_icon="📊", layout="wide")
tabs = st.tabs([
    "Overview", "Financial", "Occupancy", "Performance", "Bulk Actions", "Scheduled", "AI Assistant"
])

# --- Data Load ---
df = fetch_reports()
scheduled_df = fetch_scheduled_reports()

# --- Advanced Filtering ---
st.sidebar.header("🔎 Advanced Filters")
report_types = df['reportType'].unique().tolist()
statuses = df['status'].unique().tolist()
entities = df['entityType'].unique().tolist()

selected_types = st.sidebar.multiselect("Report Type", report_types, default=report_types)
selected_statuses = st.sidebar.multiselect("Status", statuses, default=statuses)
selected_entities = st.sidebar.multiselect("Entity Type", entities, default=entities)
date_range = st.sidebar.date_input("Date Range", [df['startDate'].min(), df['endDate'].max()])

filtered_df = df[
    df['reportType'].isin(selected_types) &
    df['status'].isin(selected_statuses) &
    df['entityType'].isin(selected_entities) &
    (df['startDate'] >= pd.to_datetime(date_range[0])) &
    (df['endDate'] <= pd.to_datetime(date_range[1]))
]

# --- Tab 0: Overview ---
with tabs[0]:
    st.header("📊 Dashboard Overview")
        col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Reports", f"{len(filtered_df):,}")
    col2.metric("Total Revenue", f"${filtered_df['totalRevenue'].sum():,.0f}")
    col3.metric("Avg Occupancy", f"{filtered_df['occupancyRate'].mean():.1f}%")
    col4.metric("Generated", f"{(filtered_df['status']=='GENERATED').sum()}/{len(filtered_df)}")
    st.plotly_chart(px.pie(filtered_df, names='status', title='Status Distribution'), use_container_width=True)
    st.plotly_chart(px.pie(filtered_df, names='reportType', title='Type Distribution'), use_container_width=True)
    st.plotly_chart(px.density_heatmap(filtered_df, x='startDate', y='entityType', z='totalRevenue', title='Revenue Heatmap'), use_container_width=True)
    st.plotly_chart(px.imshow(filtered_df.corr(numeric_only=True), title='Correlation Matrix'), use_container_width=True)
    st.dataframe(filtered_df.head(20), use_container_width=True)

# --- Tab 1: Financial ---
with tabs[1]:
        st.header("💰 Financial Analytics")
    st.plotly_chart(px.bar(filtered_df, x='reportType', y='totalRevenue', title='Revenue by Type'), use_container_width=True)
    st.plotly_chart(px.bar(filtered_df, x='reportType', y='averagePrice', title='Avg Price by Type'), use_container_width=True)
    st.plotly_chart(px.pie(filtered_df, values='totalRevenue', names='entityType', title='Revenue by Entity'), use_container_width=True)
    st.dataframe(filtered_df[['title','reportType','totalRevenue','averagePrice','entityType']].head(20), use_container_width=True)

# --- Tab 2: Occupancy ---
with tabs[2]:
        st.header("🏠 Occupancy Analytics")
    st.plotly_chart(px.line(filtered_df, x='startDate', y='occupancyRate', color='entityType', title='Occupancy Trend'), use_container_width=True)
    st.plotly_chart(px.bar(filtered_df, x='reportType', y='occupancyRate', title='Occupancy by Type'), use_container_width=True)
    st.dataframe(filtered_df[['title','reportType','occupancyRate','entityType']].head(20), use_container_width=True)

# --- Tab 3: Performance ---
with tabs[3]:
        st.header("📈 Performance Analytics")
    st.plotly_chart(px.scatter(filtered_df, x='occupancyRate', y='totalRevenue', color='reportType', title='Revenue vs Occupancy'), use_container_width=True)
    st.plotly_chart(px.line(filtered_df, x='startDate', y='totalReservations', color='entityType', title='Reservations Trend'), use_container_width=True)
    st.dataframe(filtered_df[['title','reportType','totalReservations','completedReservations','cancelledReservations','entityType']].head(20), use_container_width=True)

# --- Tab 4: Bulk Actions ---
with tabs[4]:
    st.header("🗂️ Bulk Actions")
    st.write("Select reports for bulk download, delete, or regenerate.")
    selected = st.multiselect("Select Reports", filtered_df['title'].tolist())
    col1, col2, col3 = st.columns(3)
        with col1:
        if st.button("Download Selected"):
            st.info("Download started (simulated).")
        with col2:
        if st.button("Delete Selected"):
            st.warning("Delete action simulated.")
    with col3:
        if st.button("Regenerate Selected"):
            st.success("Regeneration simulated.")

# --- Tab 5: Scheduled Reports ---
with tabs[5]:
        st.header("⏰ Scheduled Reports")
    st.dataframe(scheduled_df, use_container_width=True)
    st.write("Manage schedules (toggle, edit, trigger). [Simulated UI]")
    for idx, row in scheduled_df.iterrows():
        cols = st.columns([2,2,2,2,2])
        cols[0].write(row['title'])
        cols[1].write(row['frequency'])
        cols[2].write("🟢" if row['isActive'] else "🔴")
        if cols[3].button("Toggle", key=f"toggle_{row['id']}"):
            st.info(f"Toggled {row['title']} (simulated)")
        if cols[4].button("Trigger Now", key=f"trigger_{row['id']}"):
            st.success(f"Triggered {row['title']} (simulated)")

# --- Tab 6: AI Assistant ---
with tabs[6]:
        st.header("🤖 AI Report Analytics Assistant")
    st.write("Ask for charts, filters, or insights in natural language. [Simulated]")
    user_query = st.text_input("Ask the assistant...")
    if user_query:
        st.info(f"Simulated AI response for: {user_query}")
        if "revenue" in user_query.lower():
            st.plotly_chart(px.line(filtered_df, x='startDate', y='totalRevenue', title='Revenue Trend (AI Generated)'), use_container_width=True)
        elif "occupancy" in user_query.lower():
            st.plotly_chart(px.line(filtered_df, x='startDate', y='occupancyRate', title='Occupancy Trend (AI Generated)'), use_container_width=True)
        elif "top" in user_query.lower():
            top_entities = filtered_df.groupby('entityType')['totalRevenue'].sum().sort_values(ascending=False).head(5)
            st.bar_chart(top_entities)
                    else:
            st.write("[Simulated] I can generate charts, filter data, and provide insights!")
    st.write("---")
    st.write("Quick Actions: [Simulated]")
    col1, col2, col3 = st.columns(3)
    if col1.button("Generate Financial Report (AI)"):
        st.info("AI-generated financial report started (simulated)")
    if col2.button("Generate Occupancy Report (AI)"):
        st.info("AI-generated occupancy report started (simulated)")
    if col3.button("Schedule Report (AI)"):
        st.info("AI-scheduled report started (simulated)")

# --- Footer ---
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666;">
        <p>📊 Report Analytics Dashboard - Powered by AI/ML Technologies</p>
    <p>Features: Live Data • Advanced Filtering • Drilldown • Interactive Visuals • Bulk Actions • Scheduling • AI Assistant</p>
    </div>
    """, unsafe_allow_html=True)