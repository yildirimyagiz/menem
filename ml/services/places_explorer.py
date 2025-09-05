import streamlit as st
import pandas as pd
from streamlit_extras.badges import badge
from streamlit_extras.metric_cards import style_metric_cards
from streamlit_folium import st_folium
import folium
from utils.ui import inject_global_css

# --- Category and emoji mapping ---
CATEGORY_MAP = {
    "all": "All",
    "restaurant": "Restaurant",
    "school": "School",
    "facility": "Facility",
    "sport": "Sport Center",
}
CATEGORY_EMOJI = {
    "all": "📍",
    "restaurant": "🍽️",
    "school": "🏫",
    "facility": "🏢",
    "sport": "🏟️",
    "default": "📍",
}

# --- Sample data (replace with API call) ---
SAMPLE_PLACES = [
    {"id": "1", "name": "Central Park Cafe", "type": "restaurant", "address": "123 Main St", "rating": 4.5, "location": {"lat": 37.7749, "lng": -122.4194}},
    {"id": "2", "name": "Greenwood School", "type": "school", "address": "456 Oak Ave", "rating": 4.2, "location": {"lat": 37.7799, "lng": -122.4144}},
    {"id": "3", "name": "City Sports Center", "type": "sport", "address": "789 Pine Rd", "rating": 4.7, "location": {"lat": 37.7700, "lng": -122.4300}},
    {"id": "4", "name": "Downtown Facility", "type": "facility", "address": "101 Elm Blvd", "rating": 4.0, "location": {"lat": 37.7800, "lng": -122.4200}},
]

# --- UI Controls ---
def filter_places(places: list, category: str, search_query: str) -> list:
    """Filter places by category and search query."""
    filtered = [p for p in places if (category == "all" or p["type"] == category)]
    if search_query:
        filtered = [p for p in filtered if search_query.lower() in p["name"].lower()]
    return filtered

def render_places_list(places: list) -> None:
    """Render the list view of places."""
    st.markdown("## 📋 Places List")
    for place in places:
        col1, col2 = st.columns([1, 5])
        with col1:
            st.markdown(f"{CATEGORY_EMOJI.get(place['type'], '📍')}")
        with col2:
            st.markdown(f"""**{place['name']}**  
{place['address']}  
⭐ {place['rating']}""")
    if not places:
        st.info("No places found for the selected filters.")

def render_places_map(places: list) -> None:
    """Render the map view of places."""
    st.markdown("## 🗺️ Map View")
    m = folium.Map(location=[37.7749, -122.4194], zoom_start=13)
    for place in places:
        folium.Marker(
            location=[place["location"]["lat"], place["location"]["lng"]],
            popup=f"{place['name']}<br>{place['address']}",
            tooltip=place["name"],
            icon=folium.Icon(color="blue", icon="info-sign")
        ).add_to(m)
    st_folium(m, width=800, height=500)

def main():
    inject_global_css()
    st.set_page_config(page_title="Places Explorer", page_icon="📍", layout="wide")
    st.markdown("<h1 class='main-header'>Places Explorer</h1>", unsafe_allow_html=True)
    badge(type="github", name="Reservatior/ML-SuperApp")

    col1, col2 = st.columns([2, 3])
    with col1:
        category = st.selectbox("Category", list(CATEGORY_MAP.keys()), format_func=lambda x: f"{CATEGORY_EMOJI.get(x, '📍')} {CATEGORY_MAP[x]}", help="Filter places by category.")
    with col2:
        search_query = st.text_input("Search places", "", help="Type to search for a place by name.")

    view_mode = st.radio("View Mode", ["List", "Map"], horizontal=True, help="Switch between list and map views.")

    filtered_places = filter_places(SAMPLE_PLACES, category, search_query)

    if view_mode == "List":
        render_places_list(filtered_places)
    else:
        render_places_map(filtered_places)

if __name__ == "__main__":
    main() 