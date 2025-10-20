// Check if Gemini AI package is available
let GoogleGenerativeAI;
try {
    GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (error) {
    console.warn('@google/generative-ai package not installed. AI features will use fallback responses.');
    GoogleGenerativeAI = null;
}

class GeminiService {
    constructor() {
        this.isGeminiAvailable = GoogleGenerativeAI && process.env.GEMINI_API_KEY;
        
        if (this.isGeminiAvailable) {
            try {
                this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            } catch (error) {
                console.error('Failed to initialize Gemini AI:', error);
                this.isGeminiAvailable = false;
            }
        }
    }

    async generateTaskDescription(title, context = '') {
        if (!this.isGeminiAvailable) {
            // Fallback response when Gemini AI is not available
            return `Complete the task: ${title}. ${context ? `This task is related to ${context}.` : ''} Please ensure all requirements are met and the task is completed according to specifications.`;
        }

        try {
            const prompt = `Generate a detailed task description for a task titled "${title}". 
            ${context ? `Context: ${context}` : ''}
            
            The description should be:
            - Clear and actionable
            - Include specific steps or requirements
            - Be professional and concise
            - Suitable for a task management system
            
            Return only the description without any additional formatting or explanations.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Error generating task description:', error);
            // Return fallback response on error
            return `Complete the task: ${title}. ${context ? `This task is related to ${context}.` : ''} Please ensure all requirements are met and the task is completed according to specifications.`;
        }
    }

    async suggestPriority(title, description) {
        if (!this.isGeminiAvailable) {
            // Simple fallback priority suggestion based on keywords
            const urgentKeywords = ['urgent', 'asap', 'immediate', 'critical', 'deadline'];
            const importantKeywords = ['important', 'review', 'update', 'meeting'];
            
            const text = (title + ' ' + description).toLowerCase();
            
            if (urgentKeywords.some(keyword => text.includes(keyword))) {
                return 'Most Important';
            } else if (importantKeywords.some(keyword => text.includes(keyword))) {
                return 'Important';
            } else {
                return 'Least Important';
            }
        }

        try {
            const prompt = `Analyze the following task and suggest an appropriate priority level:
            
            Title: ${title}
            Description: ${description}
            
            Priority levels available: Most Important, Important, Least Important
            
            Consider factors like:
            - Urgency and deadlines
            - Impact on business/project
            - Complexity and effort required
            - Dependencies on other tasks
            
            Return only the priority level (Most Important, Important, or Least Important) without any additional text.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Error suggesting priority:', error);
            // Return fallback priority
            return 'Important';
        }
    }

    async generateTaskSuggestions(projectContext = '', employeeRole = '') {
        if (!this.isGeminiAvailable) {
            // Fallback task suggestions
            return [
                {
                    title: "Review project documentation",
                    description: "Review and update project documentation to ensure accuracy and completeness",
                    priority: "Important"
                },
                {
                    title: "Team meeting preparation",
                    description: "Prepare agenda and materials for upcoming team meeting",
                    priority: "Most Important"
                },
                {
                    title: "Code review and testing",
                    description: "Review code changes and perform necessary testing procedures",
                    priority: "Important"
                },
                {
                    title: "Update project status",
                    description: "Update project status and progress in the management system",
                    priority: "Least Important"
                },
                {
                    title: "Client communication",
                    description: "Follow up with client regarding project updates and requirements",
                    priority: "Important"
                }
            ];
        }

        try {
            const prompt = `Generate 5 relevant task suggestions for a task management system.
            
            ${projectContext ? `Project Context: ${projectContext}` : ''}
            ${employeeRole ? `Employee Role: ${employeeRole}` : ''}
            
            Each suggestion should include:
            - A clear, actionable title
            - A brief description
            - Suggested priority level (Most Important, Important, Least Important)
            
            Format the response as a JSON array with objects containing: title, description, priority
            Example: [{"title": "Review code changes", "description": "Review and approve pending code changes in the repository", "priority": "Important"}]`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const suggestions = JSON.parse(response.text().trim());
            return suggestions;
        } catch (error) {
            console.error('Error generating task suggestions:', error);
            // Return fallback suggestions
            return [
                {
                    title: "Review project documentation",
                    description: "Review and update project documentation to ensure accuracy and completeness",
                    priority: "Important"
                },
                {
                    title: "Team meeting preparation",
                    description: "Prepare agenda and materials for upcoming team meeting",
                    priority: "Most Important"
                },
                {
                    title: "Code review and testing",
                    description: "Review code changes and perform necessary testing procedures",
                    priority: "Important"
                },
                {
                    title: "Update project status",
                    description: "Update project status and progress in the management system",
                    priority: "Least Important"
                },
                {
                    title: "Client communication",
                    description: "Follow up with client regarding project updates and requirements",
                    priority: "Important"
                }
            ];
        }
    }

    async analyzeTaskPerformance(tasks) {
        if (!this.isGeminiAvailable) {
            // Fallback analysis
            const totalTasks = tasks.length;
            const priorityCounts = tasks.reduce((acc, task) => {
                acc[task.priority] = (acc[task.priority] || 0) + 1;
                return acc;
            }, {});

            return {
                priorityAnalysis: `Total tasks: ${totalTasks}. Priority distribution: Most Important (${priorityCounts['Most Important'] || 0}), Important (${priorityCounts['Important'] || 0}), Least Important (${priorityCounts['Least Important'] || 0})`,
                bottlenecks: "Consider reviewing task priorities and deadlines to identify potential bottlenecks.",
                recommendations: "Focus on completing high-priority tasks first and ensure proper task distribution among team members.",
                productivityInsights: "Monitor task completion rates and adjust priorities based on project requirements."
            };
        }

        try {
            const taskSummary = tasks.map(task => ({
                title: task.title,
                priority: task.priority,
                status: task.status || 'pending'
            }));

            const prompt = `Analyze the following task data and provide insights:
            
            Tasks: ${JSON.stringify(taskSummary)}
            
            Provide insights on:
            1. Priority distribution analysis
            2. Potential bottlenecks or issues
            3. Recommendations for improvement
            4. Productivity patterns
            
            Format as a JSON object with keys: priorityAnalysis, bottlenecks, recommendations, productivityInsights`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const analysis = JSON.parse(response.text().trim());
            return analysis;
        } catch (error) {
            console.error('Error analyzing task performance:', error);
            // Return fallback analysis
            const totalTasks = tasks.length;
            const priorityCounts = tasks.reduce((acc, task) => {
                acc[task.priority] = (acc[task.priority] || 0) + 1;
                return acc;
            }, {});

            return {
                priorityAnalysis: `Total tasks: ${totalTasks}. Priority distribution: Most Important (${priorityCounts['Most Important'] || 0}), Important (${priorityCounts['Important'] || 0}), Least Important (${priorityCounts['Least Important'] || 0})`,
                bottlenecks: "Consider reviewing task priorities and deadlines to identify potential bottlenecks.",
                recommendations: "Focus on completing high-priority tasks first and ensure proper task distribution among team members.",
                productivityInsights: "Monitor task completion rates and adjust priorities based on project requirements."
            };
        }
    }
}

module.exports = new GeminiService();
