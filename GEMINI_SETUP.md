# Gemini AI Integration Setup

This task management application now includes AI-powered features using Google's Gemini AI. Follow these steps to set up the integration:

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install @google/generative-ai
   ```

2. **Environment Configuration**
   Add the following to your `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and add it to your `.env` file

## Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install @google/generative-ai
   ```

## AI Features Available

### 1. AI Task Suggestions
- Generate contextual task suggestions based on project and employee role
- Located in the "Add Task" modal
- Click "Get AI Task Suggestions" to generate relevant tasks

### 2. AI Description Generator
- Generate detailed task descriptions based on task title
- Located below the title input in "Add Task" modal
- Click "Generate AI Description" after entering a title

### 3. AI Priority Suggestion
- Analyze task content to suggest appropriate priority level
- Located in the "Add Task" modal
- Click "Suggest Priority" after entering title and description

### 4. AI Task Insights
- Analyze task performance and provide insights
- Located on the right side of the Tasks dashboard
- Click "Analyze Task Performance" to get AI insights

## API Endpoints

The following AI endpoints are available:

- `POST /api/ai/generate-description` - Generate task description
- `POST /api/ai/suggest-priority` - Suggest task priority
- `POST /api/ai/task-suggestions` - Get task suggestions
- `POST /api/ai/analyze-performance` - Analyze task performance

## Usage

1. **Creating Tasks with AI**
   - Open the "Add Task" modal
   - Use AI suggestions to quickly populate task details
   - Generate descriptions and priority suggestions automatically

2. **Getting Insights**
   - Navigate to the Tasks page
   - Use the AI Task Insights panel to analyze your task performance
   - Get recommendations for improving productivity

## Troubleshooting

- Ensure your Gemini API key is correctly set in the `.env` file
- Check that the backend server is running
- Verify that all dependencies are installed
- Check browser console for any error messages

## Security Notes

- Keep your Gemini API key secure and never commit it to version control
- The API key is only used on the backend for security
- All AI requests are authenticated using your existing JWT tokens
