#!/bin/bash
# Robust Android dev script for Next.js + Capacitor hybrid
# 1. Kills all node processes on port 3001
# 2. Patches Gradle for Java 17
# 3. Starts Next.js dev server on port 3001 in background
# 4. Waits for server to be ready
# 5. Patches Gradle again (in case Capacitor regenerates)
# 6. Runs Gradle build/install directly for Android
# Usage: ./scripts/android-dev.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/.."
ANDROID_DIR="$CLIENT_DIR/android"

cd "$CLIENT_DIR"

# 1. Kill all node processes on port 3001
PIDS=$(lsof -ti :3001)
if [ -n "$PIDS" ]; then
  echo "Killing processes on port 3001: $PIDS"
  kill -9 $PIDS
else
  echo "No processes found on port 3001."
fi

# 2. Patch Gradle for Java 17
bash "$SCRIPT_DIR/fix-capacitor-java17.sh"

# 3. Start Next.js dev server on port 3001 in background
export NODE_ENV=development
pnpm with-env next dev -p 3001 &
NEXT_PID=$!

# 4. Wait for Next.js to be ready
until curl -s http://localhost:3001 >/dev/null; do
  echo "Waiting for Next.js dev server to start on port 3001..."
  sleep 2
done

# 5. Patch Gradle again (in case Capacitor/CLI overwrites)
bash "$SCRIPT_DIR/fix-capacitor-java17.sh"

# 6. Run Gradle build/install for Android
echo "Running Gradle assembleDebug..."
cd "$ANDROID_DIR"
./gradlew assembleDebug
BUILD_RESULT=$?

# Optionally, install to device/emulator if build succeeds
if [ $BUILD_RESULT -eq 0 ]; then
  echo "Build succeeded. Installing to device/emulator..."
  ./gradlew installDebug
else
  echo "Build failed. See logs above."
fi

# Clean up Next.js dev server
kill $NEXT_PID

cd "$CLIENT_DIR"
echo "Android dev workflow complete."
