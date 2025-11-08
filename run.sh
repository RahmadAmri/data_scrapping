#!/bin/bash

# Legal Data Acquisition System - Setup and Run Script

echo "🔍 Legal Data Acquisition System"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

# Create output directory
mkdir -p output/screenshots

echo "✓ Output directories created"
echo ""

# Run the application
echo "🚀 Starting data acquisition..."
echo ""
node index.js

echo ""
echo "✅ Process completed!"
echo ""
echo "📁 Check the output/ directory for results:"
echo "   - processed_data.json: Cleaned data"
echo "   - report_*.html: Detailed HTML report"
echo ""
