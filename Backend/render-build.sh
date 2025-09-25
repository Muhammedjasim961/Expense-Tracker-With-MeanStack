#!/bin/bash
echo "Starting Render build process..."

# Navigate to frontend and build Angular
cd ../frontend
echo "Installing frontend dependencies..."
npm install

echo "Building Angular app..."
ng build --configuration production

# Return to backend
cd ../Backend
echo "Installing backend dependencies..."
npm install

echo "Build completed successfully!"
