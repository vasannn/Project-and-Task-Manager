import React, { useState } from 'react';
import {
    Box,
    Button,
    VStack,
    HStack,
    Text,
    Spinner,
    useToast,
    Badge,
    Divider
} from '@chakra-ui/react';
import { FaMagic, FaLightbulb } from 'react-icons/fa';
import aiService from '../../services/aiService';

function AITaskSuggestions({ onSuggestionSelect, projectContext = '', employeeRole = '' }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const getSuggestions = async () => {
        setLoading(true);
        try {
            const taskSuggestions = await aiService.getTaskSuggestions(projectContext, employeeRole);
            setSuggestions(taskSuggestions);
        } catch (error) {
            toast({
                title: 'Failed to generate suggestions',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        onSuggestionSelect(suggestion);
        toast({
            title: 'Suggestion applied',
            description: 'Task details have been filled with AI suggestion',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
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
        <Box>
            <Button
                leftIcon={<FaMagic />}
                colorScheme="purple"
                variant="outline"
                onClick={getSuggestions}
                isLoading={loading}
                loadingText="Generating..."
                mb={4}
                w="full"
            >
                Get AI Task Suggestions
            </Button>

            {suggestions.length > 0 && (
                <Box>
                    <HStack mb={3}>
                        <FaLightbulb color="#805AD5" />
                        <Text fontWeight="bold" color="purple.600">
                            AI Suggestions
                        </Text>
                    </HStack>
                    
                    <VStack spacing={3} align="stretch">
                        {suggestions.map((suggestion, index) => (
                            <Box
                                key={index}
                                p={4}
                                border="1px solid"
                                borderColor="purple.200"
                                borderRadius="md"
                                bg="purple.50"
                                cursor="pointer"
                                _hover={{
                                    bg: "purple.100",
                                    borderColor: "purple.300"
                                }}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <VStack align="start" spacing={2}>
                                    <Text fontWeight="semibold" fontSize="sm">
                                        {suggestion.title}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {suggestion.description}
                                    </Text>
                                    <HStack>
                                        <Badge colorScheme={getPriorityColor(suggestion.priority)} size="sm">
                                            {suggestion.priority}
                                        </Badge>
                                        <Text fontSize="xs" color="purple.600">
                                            Click to apply
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>
                        ))}
                    </VStack>
                </Box>
            )}
        </Box>
    );
}

export default AITaskSuggestions;
