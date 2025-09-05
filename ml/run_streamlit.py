#!/usr/bin/env python3
"""
Streamlit ML Photo Analyzer Runner
This script starts the Streamlit app with proper configuration.
"""

import subprocess
import sys
import os

def main():
    """Start the Streamlit app"""
    print("🚀 Starting ML Photo Analyzer...")
    print("📊 Streamlit will open in your browser")
    print("📍 URL: http://localhost:8501")
    print("⏹️  Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        # Run streamlit with the app
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "app.py",
            "--server.port", "8501",
            "--server.address", "localhost",
            "--browser.gatherUsageStats", "false"
        ])
    except KeyboardInterrupt:
        print("\n👋 Streamlit app stopped.")
    except Exception as e:
        print(f"❌ Error starting Streamlit: {e}")

if __name__ == "__main__":
    main() 