import streamlit as st
from streamlit_option_menu import option_menu
from st_pages import Page, show_pages, add_page_title
from streamlit_extras.metric_cards import style_metric_cards
from streamlit_extras.let_it_rain import rain
from streamlit_extras.badges import badge

# --- Configure multipage navigation ---
show_pages([
    Page("main_app.py", "🏠 Home", "home"),
    Page("services/property_map_visualizer.py", "🗺️ Property Map", "map"),
    Page("services/places_explorer.py", "📍 Places Explorer", "places"),
    Page("services/places_analyzer.py", "🔍 Places Analyzer", "places_analyzer"),
    Page("analytics/analytics_dashboard.py", "📊 Analytics Dashboard", "analytics_dashboard"),
    Page("analytics/analytics_metrics.py", "📈 Metrics & Trends", "analytics_metrics"),
    Page("analytics/analytics_entity_drilldown.py", "🔎 Entity Drilldown", "analytics_drilldown"),
    Page("services/enhanced_property_management.py", "🏢 Property Management", "management"),
    Page("services/advanced_property_analytics.py", "📊 Advanced Analytics", "advanced_analytics"),
    Page("services/reports/report_analytics_dashboard.py", "📄 Report Analytics", "report_analytics"),
    Page("services/reports/report_generation_service.py", "📝 Report Generation", "report_generation"),
    Page("settings_page.py", "⚙️ Settings", "settings"),
])
add_page_title()

# --- Sidebar with collapsible sections ---
with st.sidebar:
    st.markdown("<h2 style='margin-bottom:0.5rem;'>ML SuperApp</h2>", unsafe_allow_html=True)
    with st.expander("🏠 Overview", expanded=True):
        if st.button("Home", key="home_btn"):
            st.switch_page("main_app.py")
    with st.expander("📊 Analytics", expanded=True):
        if st.button("Analytics Dashboard", key="analytics_dashboard_btn"):
            st.switch_page("analytics/analytics_dashboard.py")
        if st.button("Metrics & Trends", key="metrics_btn"):
            st.switch_page("analytics/analytics_metrics.py")
        if st.button("Entity Drilldown", key="drilldown_btn"):
            st.switch_page("analytics/analytics_entity_drilldown.py")
        if st.button("Advanced Analytics", key="advanced_analytics_btn"):
            st.switch_page("services/advanced_property_analytics.py")
    with st.expander("🗺️ Maps & Places", expanded=False):
        if st.button("Property Map", key="map_btn"):
            st.switch_page("services/property_map_visualizer.py")
        if st.button("Places Explorer", key="places_explorer_btn"):
            st.switch_page("services/places_explorer.py")
        if st.button("Places Analyzer", key="places_analyzer_btn"):
            st.switch_page("services/places_analyzer.py")
    with st.expander("🏢 Management", expanded=False):
        if st.button("Property Management", key="management_btn"):
            st.switch_page("services/enhanced_property_management.py")
    with st.expander("📄 Reports", expanded=False):
        if st.button("Report Analytics", key="report_analytics_btn"):
            st.switch_page("services/reports/report_analytics_dashboard.py")
        if st.button("Report Generation", key="report_generation_btn"):
            st.switch_page("services/reports/report_generation_service.py")
    with st.expander("⚙️ Settings", expanded=False):
        if st.button("Settings", key="settings_btn"):
            st.switch_page("settings_page.py")

# --- Main content for Home page ---
if st.session_state.get('current_page', None) == "main_app.py" or st.session_state.get('current_page', None) is None:
    st.markdown("<h1 style='text-align:center; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>Reservatior ML SuperApp</h1>", unsafe_allow_html=True)
    st.write(":sparkles: Welcome to your all-in-one ML dashboard and analytics suite!")
    badge(type="github", name="Reservatior/ML-SuperApp")
    style_metric_cards(background="#667eea", border_left_color="#764ba2", border_radius_px=12)
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Active Properties", "1,245", "+12")
    with col2:
        st.metric("Total Revenue", "$2.1M", "+5%")
    with col3:
        st.metric("Avg. ML Score", "87.2", "+1.3")
    rain(emoji="🏠", font_size=32, falling_speed=5, animation_length="infinite")
    st.markdown("---")
    st.write("Use the sidebar to navigate between Property Map, Analytics, Reports, and Settings.") 