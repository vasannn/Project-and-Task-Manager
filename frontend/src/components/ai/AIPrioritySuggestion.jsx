import React, { useState } from 'react';
import {
    Button,
    HStack,
    useToast,
    Spinner,
    Badge,
    Text,
    VStack
} from '@chakra-ui/react';
import { FaBrain, FaCheck } from 'react-icons/fa';
import aiService from '../../services/aiService';

function AIPrioritySuggestion({ title, description, onPrioritySuggested }) {
    const [loading, setLoading] = useState(false);
    const [suggestedPriority, setSuggestedPriority] = useState(null);
    const toast = useToast();

    const suggestPriority = async () => {
        if (!title.trim() || !description.trim()) {
            toast({
                title: 'Content required',
                description: 'Please enter both title and description',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const priority = await aiService.suggestPriority(title, description);
            setSuggestedPriority(priority);
            onPrioritySuggested(priority);
        } catch (error) {
            toast({
                title: 'Failed to suggest priority',
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

    const applySuggestion = () => {
        if (suggestedPriority) {
            onPrioritySuggested(suggestedPriority);
            toast({
                title: 'Priority applied',
                description: `Priority set to ${suggestedPriority}`,
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack align="start" spacing={2}>
            <Button
                leftIcon={<FaBrain />}
                colorScheme="orange"
                variant="outline"
                size="sm"
                onClick={suggestPriority}
                isLoading={loading}
                loadingText="Analyzing..."
                isDisabled={!title.trim() || !description.trim()}
            >
                Suggest Priority
            </Button>

            {suggestedPriority && (
                <HStack spacing={3}>
                    <Text fontSize="sm" color="gray.600">
                        AI suggests:
                    </Text>
                    <Badge 
                        colorScheme={getPriorityColor(suggestedPriority)} 
                        size="lg"
                        borderRadius="full"
                    >
                        {suggestedPriority}
                    </Badge>
                    <Button
                        leftIcon={<FaCheck />}
                        size="xs"
                        colorScheme="green"
                        variant="solid"
                        onClick={applySuggestion}
                    >
                        Apply
                    </Button>
                </HStack>
            )}
        </VStack>
    );
}

export default AIPrioritySuggestion;
