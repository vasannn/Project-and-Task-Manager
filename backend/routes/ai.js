const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const geminiService = require('../services/geminiService');

// Generate task description based on title
router.post('/ai/generate-description', authMiddleware, async (req, res) => {
    try {
        const { title, context } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const description = await geminiService.generateTaskDescription(title, context);
        res.json({ description });
    } catch (error) {
        console.error('Error generating description:', error);
        res.status(500).json({ message: 'Failed to generate task description' });
    }
});

// Suggest priority based on task content
router.post('/ai/suggest-priority', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const priority = await geminiService.suggestPriority(title, description);
        res.json({ priority });
    } catch (error) {
        console.error('Error suggesting priority:', error);
        res.status(500).json({ message: 'Failed to suggest priority' });
    }
});

// Generate task suggestions
router.post('/ai/task-suggestions', authMiddleware, async (req, res) => {
    try {
        const { projectContext, employeeRole } = req.body;
        
        const suggestions = await geminiService.generateTaskSuggestions(projectContext, employeeRole);
        res.json({ suggestions });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ message: 'Failed to generate task suggestions' });
    }
});

// Analyze task performance
router.post('/ai/analyze-performance', authMiddleware, async (req, res) => {
    try {
        const { tasks } = req.body;
        
        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ message: 'Tasks array is required' });
        }

        const analysis = await geminiService.analyzeTaskPerformance(tasks);
        res.json({ analysis });
    } catch (error) {
        console.error('Error analyzing performance:', error);
        res.status(500).json({ message: 'Failed to analyze task performance' });
    }
});

module.exports = router;
