#!/bin/bash
# Prebuild helper: patch Java 17 and kill port 3001 processes for Android build
# Usage: ./scripts/prebuild-android.sh

# Patch Gradle Java version
./scripts/fix-capacitor-java17.sh

# Kill any node process on port 3001
echo "Checking for processes on port 3001..."
PIDS=$(lsof -ti :3001)
if [ -n "$PIDS" ]; then
  echo "Killing processes: $PIDS"
  kill -9 $PIDS
else
  echo "No processes found on port 3001."
fi

echo "Prebuild steps complete. Ready for pnpm cap:dev:android"
