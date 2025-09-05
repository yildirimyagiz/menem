import streamlit as st
import requests
import time

st.set_page_config(page_title="Listings Widget", layout="wide", initial_sidebar_state="collapsed")

user_id = st.query_params.get("user", "demo")
listing_id = st.query_params.get("listing", "demo-listing")

# --- Channel API helpers ---
API_BASE = "http://localhost:2998/api"  # Change to your API base

# Create or get a channel for this user/listing
@st.cache_data(ttl=600)
def get_or_create_channel(user_id: str, listing_id: str) -> str:
    # Try to find an existing channel
    resp = requests.get(f"{API_BASE}/channels?name={user_id}-{listing_id}")
    if resp.ok and resp.json().get("data"):
        return resp.json()["data"][0]["id"]
    # Otherwise, create a new channel
    payload = {
        "name": f"{user_id}-{listing_id}",
        "description": f"Chat for {user_id} on {listing_id}",
        "category": "PROPERTY",
        "type": "GROUP"
    }
    resp = requests.post(f"{API_BASE}/channels", json=payload)
    return resp.json()["id"]

# Get messages for a channel
def get_channel_messages(channel_id: str):
    try:
        resp = requests.get(f"{API_BASE}/channels/{channel_id}/messages")
        if resp.ok:
            return resp.json().get("data", [])
    except Exception:
        pass
    return []

# Post a message to a channel
def post_message(channel_id: str, content: str, sender: str):
    payload = {"content": content, "sender": sender}
    try:
        requests.post(f"{API_BASE}/channels/{channel_id}/messages", json=payload)
    except Exception:
        pass

# AI response via Ollama
def query_ollama_llama32(prompt: str) -> str:
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3.2", "prompt": prompt, "stream": False},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data.get("response", "[No response from Llama 3.2]")
    except Exception as e:
        return f"[Ollama error: {e}]"

# --- Fetch listings for this user (mocked for demo) ---
def fetch_listings(user_id: str):
    if user_id == "demo":
        return [
            {"title": "Modern Apartment Downtown", "address": "123 Main St", "price": "$2,500/mo"},
            {"title": "Cozy Studio", "address": "456 Oak Ave", "price": "$1,800/mo"},
            {"title": "Family House", "address": "789 Pine Rd", "price": "$5,200/mo"},
        ]
    return []

listings = fetch_listings(user_id)

st.markdown(f"<h2 style='margin-bottom:1rem;'>Listings for <span style='color:#667eea'>{user_id}</span></h2>", unsafe_allow_html=True)
if listings:
    for listing in listings:
        st.markdown(f"""
        <div style='padding:1rem; border-radius:8px; background:#f8fafc; margin-bottom:1rem; box-shadow:0 1px 4px #e0e7ff;'>
            <strong style='font-size:1.1rem;'>{listing['title']}</strong><br>
            <span style='color:#555;'>{listing['address']}</span><br>
            <span style='color:#764ba2; font-weight:600;'>Price: {listing['price']}</span>
        </div>
        """, unsafe_allow_html=True)
else:
    st.info("No listings found for this user.")

# --- Real-time Chat Section ---
st.markdown("---")
st.markdown("<h4>💬 Real-time Chat (AI & Admin Support)</h4>", unsafe_allow_html=True)
try:
    from st_chat_message import message as chat_message
    chat_available = True
except ImportError:
    chat_available = False
    st.warning("Install chat package: pip install st-chat-message")

if chat_available:
    channel_id = get_or_create_channel(user_id, listing_id)
    if "chat_poll_time" not in st.session_state:
        st.session_state.chat_poll_time = time.time()
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = []

    # Poll for new messages every 3 seconds
    if time.time() - st.session_state.chat_poll_time > 3:
        st.session_state.chat_messages = get_channel_messages(channel_id)
        st.session_state.chat_poll_time = time.time()

    # Show chat history
    for i, msg in enumerate(st.session_state.chat_messages):
        sender = msg.get("sender", "user")
        if sender == "user":
            chat_message(msg["content"], is_user=True, key=f"chatmsg_{i}")
        elif sender == "ai":
            chat_message("🤖 " + msg["content"], is_user=False, key=f"chatmsg_{i}")
        elif sender == "admin":
            chat_message("👨‍💼 " + msg["content"], is_user=False, key=f"chatmsg_{i}")
        else:
            chat_message(msg["content"], is_user=False, key=f"chatmsg_{i}")

    # Chat input
    user_input = st.text_input("Type your message and press Enter:", "", key="chat_input")
    if user_input:
        post_message(channel_id, user_input, sender="user")
        # AI response
        with st.spinner("Llama 3.2 is thinking..."):
            ai_response = query_ollama_llama32(f"Listings: {listings}\nChat history: {st.session_state.chat_messages}\nUser: {user_input}")
        post_message(channel_id, ai_response, sender="ai")
        st.experimental_rerun()

    st.caption("Chat powered by your local Llama 3.2 model via Ollama. Admins can join this chat from the admin panel.")

# --- Feedback (trubrics) ---
st.markdown("---")
st.info("For feedback, please install trubrics: pip install trubrics")
try:
    from trubrics import Trubrics
    from streamlit_feedback import st_feedback
    feedback = st_feedback(
        component="listings_widget",
        feedback_type="thumbs",
        text="How was your listings widget experience?",
        key="listings_widget_feedback"
    )
    if feedback:
        st.success(f"Thank you for your feedback! Rating: {feedback['score']}")
except ImportError:
    st.caption("Trubrics feedback component not installed. Run: pip install trubrics streamlit-feedback")

st.caption("<div style='text-align:center; color:#888; margin-top:2rem;'>Powered by <b>Reservatior</b></div>", unsafe_allow_html=True)

# --- Admin Panel Note ---
st.markdown("""
---
**Admin Panel:**
Admins can view and reply to all channels/messages via a dedicated admin dashboard (to be implemented in a separate Streamlit app or Next.js admin panel).
""") 