import streamlit as st

def inject_global_css():
    """Inject global CSS for consistent modern styling across all Streamlit apps."""
    st.markdown("""
    <style>
    .main-header { font-size: 2.5rem; font-weight: bold; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; margin-bottom: 2rem; }
    .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.2rem 1rem; border-radius: 1rem; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(102,126,234,0.08); text-align: center; }
    .stTabs [data-baseweb="tab-list"] { background: #f8fafc; border-radius: 0.5rem 0.5rem 0 0; box-shadow: 0 2px 8px rgba(102,126,234,0.08); }
    .stTabs [data-baseweb="tab"] { font-weight: 600; font-size: 1.1rem; }
    .stDataFrame, .stTable { border-radius: 0.5rem; overflow: hidden; box-shadow: 0 2px 8px rgba(102,126,234,0.08); }
    .stPlotlyChart, .stAltairChart { border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(102,126,234,0.08); }
    .stButton>button { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 0.5rem; font-weight: 600; padding: 0.5rem 1.2rem; }
    .stButton>button:hover { background: linear-gradient(90deg, #764ba2 0%, #667eea 100%); }
    hr { border: none; border-top: 2px solid #e0e7ff; margin: 2rem 0 1rem 0; }
    </style>
    """, unsafe_allow_html=True) 