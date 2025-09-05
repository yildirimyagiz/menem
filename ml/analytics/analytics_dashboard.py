import streamlit as st
import pandas as pd
import plotly.express as px
import requests
from datetime import datetime, timedelta
from streamlit_extras.metric_cards import style_metric_cards
from streamlit_extras.badges import badge
from streamlit_extras.let_it_rain import rain

# --- Auth/session helpers (assume auth_utils.py exists) ---
try:
    from auth_utils import api_get, is_authenticated, logout
except ImportError:
    def api_get(path, **kwargs):
        return requests.get(f"http://localhost:8001/api{path}", **kwargs)
    def is_authenticated():
        return True
    def logout():
        pass

# --- AnalyticsType options (from your schema) ---
ANALYTICS_TYPE_LABELS = {
    "LISTING_VIEW": "Listing View",
    "BOOKING_CONVERSION": "Booking Conversion",
    "ML_PROPERTY_SCORE": "ML Property Score",
    "USER_ENGAGEMENT": "User Engagement",
    "REVENUE": "Revenue",
    "PERFORMANCE": "Performance",
    "AGENT_PERFORMANCE": "Agent Performance",
    "AGENCY_PERFORMANCE": "Agency Performance",
}

# --- EntityType options (from your interfaces) ---
ENTITY_TYPE_LABELS = {
    "Property": "Property",
    "User": "User",
    "Agent": "Agent",
    "Agency": "Agency",
    "Reservation": "Reservation",
    "Task": "Task",
    "Report": "Report",
    "Event": "Event",
    "Tenant": "Tenant",
    "Facility": "Facility",
    "Review": "Review",
    "CommunicationLog": "Communication Log",
}

# --- Main analytics dashboard logic will go here --- 