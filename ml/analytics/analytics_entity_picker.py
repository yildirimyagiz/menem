import streamlit as st
import requests
import pandas as pd

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

# --- Entity picker/search UI logic for analytics will go here --- 