#!/bin/bash

# Setup script for test projects
# This script helps link the chatstorm-client package to test projects

echo "🚀 Setting up ChatStorm Client test projects..."
echo ""

# Get the package root directory (parent of test directory)
PACKAGE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Package root: $PACKAGE_ROOT"
echo ""

# Link the package
echo "📦 Linking chatstorm-client package..."
cd "$PACKAGE_ROOT"
npm link
echo "✅ Package linked"
echo ""

# Setup React Web test
echo "🌐 Setting up React Web test project..."
cd "$PACKAGE_ROOT/test/react-web"
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi
npm link chatstorm-client
echo "✅ React Web test project ready"
echo ""

# Setup React Native test
echo "📱 Setting up React Native test project..."
cd "$PACKAGE_ROOT/test/react-native"
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi
npm link chatstorm-client
echo "✅ React Native test project ready"
echo ""

echo "✨ Setup complete!"
echo ""
echo "To test:"
echo "  React Web:    cd test/react-web && npm run dev"
echo "  React Native: cd test/react-native && npm run ios (or android)"
echo ""

