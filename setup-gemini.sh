#!/bin/bash

echo "🤖 Setting up Gemini AI integration for Task Management..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
if npm install @google/generative-ai; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "⚠️  Failed to install backend dependencies. AI features will use fallback responses."
fi

echo "📦 Installing frontend dependencies..."
cd ../frontend
if npm install @google/generative-ai; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "⚠️  Failed to install frontend dependencies. AI features will use fallback responses."
fi

cd ..

echo ""
echo "🔑 Next steps:"
echo "1. Get your Gemini API key from: https://makersuite.google.com/app/apikey"
echo "2. Add it to your backend/.env file: GEMINI_API_KEY=your_key_here"
echo "3. Restart your backend server"
echo ""
echo "✨ AI features are now ready to use!"
echo "   - AI Task Suggestions"
echo "   - AI Description Generator"
echo "   - AI Priority Suggestions"
echo "   - AI Task Insights"
echo ""
echo "📝 Note: If you don't have the Gemini API key, the system will use fallback responses."
