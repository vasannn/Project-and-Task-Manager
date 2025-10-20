import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    VStack,
    HStack,
    Text,
    Spinner,
    useToast,
    Badge,
    Divider,
    Card,
    CardBody,
    CardHeader,
    Heading,
    List,
    ListItem,
    ListIcon
} from '@chakra-ui/react';
import { FaBrain, FaChartLine, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import aiService from '../../services/aiService';

function AITaskInsights({ tasks = [] }) {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const analyzeTasks = async () => {
        if (tasks.length === 0) {
            toast({
                title: 'No tasks available',
                description: 'Please create some tasks first to get AI insights',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const analysis = await aiService.analyzeTaskPerformance(tasks);
            setInsights(analysis);
        } catch (error) {
            toast({
                title: 'Failed to analyze tasks',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Most Important':
                return 'red';
            case 'Important':
                return 'yellow';
            case 'Least Important':
                return 'green';
            default:
                return 'gray';
        }
    };

    return (
        <Card w="full" maxW="400px">
            <CardHeader>
                <HStack>
                    <FaBrain color="#805AD5" />
                    <Heading size="md" color="purple.600">
                        AI Task Insights
                    </Heading>
                </HStack>
            </CardHeader>
            <CardBody>
                <VStack spacing={4} align="stretch">
                    <Button
                        leftIcon={<FaChartLine />}
                        colorScheme="purple"
                        variant="outline"
                        onClick={analyzeTasks}
                        isLoading={loading}
                        loadingText="Analyzing..."
                        isDisabled={tasks.length === 0}
                    >
                        Analyze Task Performance
                    </Button>

                    {insights && (
                        <VStack spacing={4} align="stretch">
                            {/* Priority Analysis */}
                            {insights.priorityAnalysis && (
                                <Box>
                                    <Text fontWeight="bold" mb={2} color="blue.600">
                                        📊 Priority Distribution
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {insights.priorityAnalysis}
                                    </Text>
                                </Box>
                            )}

                            {/* Bottlenecks */}
                            {insights.bottlenecks && (
                                <Box>
                                    <HStack mb={2}>
                                        <FaExclamationTriangle color="#E53E3E" />
                                        <Text fontWeight="bold" color="red.600">
                                            ⚠️ Potential Issues
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.600">
                                        {insights.bottlenecks}
                                    </Text>
                                </Box>
                            )}

                            {/* Recommendations */}
                            {insights.recommendations && (
                                <Box>
                                    <HStack mb={2}>
                                        <FaLightbulb color="#38A169" />
                                        <Text fontWeight="bold" color="green.600">
                                            💡 Recommendations
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.600">
                                        {insights.recommendations}
                                    </Text>
                                </Box>
                            )}

                            {/* Productivity Insights */}
                            {insights.productivityInsights && (
                                <Box>
                                    <Text fontWeight="bold" mb={2} color="orange.600">
                                        📈 Productivity Insights
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {insights.productivityInsights}
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    )}

                    {tasks.length === 0 && (
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            Create some tasks to unlock AI insights
                        </Text>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );
}

export default AITaskInsights;
