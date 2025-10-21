#!/bin/bash

# OWNA Interface Deployment Script
# This script helps deploy to Vercel with proper configuration

set -e

echo "🚀 Starting OWNA Interface Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI not found. Installing..."
    pnpm add -g vercel
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf out

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Type check
echo "🔍 Running TypeScript type check..."
npx tsc --noEmit

# Build the project
echo "🏗️ Building project..."
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo "❌ Error: Build failed. .next directory not found."
    exit 1
fi

echo "✅ Build successful!"

# Check if Vercel is linked
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 Linking to Vercel..."
    vercel link --confirm
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Check your deployment at: https://vercel.com/dashboard"
echo "2. Verify all environment variables are set correctly"
echo "3. Test the application functionality"
echo "4. Monitor logs for any issues"