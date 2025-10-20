import axios from 'axios';

class AIService {
    constructor() {
        this.baseURL = '/api/ai';
        this.token = localStorage.getItem("tm_token");
        
        this.axiosInstance = axios.create({
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });
    }

    async generateTaskDescription(title, context = '') {
        try {
            const response = await this.axiosInstance.post(`${this.baseURL}/generate-description`, {
                title,
                context
            });
            return response.data.description;
        } catch (error) {
            console.error('Error generating task description:', error);
            // Return a fallback description
            return `Complete the task: ${title}. ${context ? `This task is related to ${context}.` : ''} Please ensure all requirements are met and the task is completed according to specifications.`;
        }
    }

    async suggestPriority(title, description) {
        try {
            const response = await this.axiosInstance.post(`${this.baseURL}/suggest-priority`, {
                title,
                description
            });
            return response.data.priority;
        } catch (error) {
            console.error('Error suggesting priority:', error);
            // Return fallback priority based on keywords
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
    }

    async getTaskSuggestions(projectContext = '', employeeRole = '') {
        try {
            const response = await this.axiosInstance.post(`${this.baseURL}/task-suggestions`, {
                projectContext,
                employeeRole
            });
            return response.data.suggestions;
        } catch (error) {
            console.error('Error getting task suggestions:', error);
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
        try {
            const response = await this.axiosInstance.post(`${this.baseURL}/analyze-performance`, {
                tasks
            });
            return response.data.analysis;
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

export default new AIService();
