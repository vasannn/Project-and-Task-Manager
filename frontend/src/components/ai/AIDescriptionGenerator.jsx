import React, { useState } from 'react';
import {
    Button,
    Textarea,
    HStack,
    useToast,
    Spinner,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { FaMagic, FaCopy, FaCheck } from 'react-icons/fa';
import aiService from '../../services/aiService';

function AIDescriptionGenerator({ title, onDescriptionGenerated, context = '' }) {
    const [loading, setLoading] = useState(false);
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [copied, setCopied] = useState(false);
    const toast = useToast();

    const generateDescription = async () => {
        if (!title.trim()) {
            toast({
                title: 'Title required',
                description: 'Please enter a task title first',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const description = await aiService.generateTaskDescription(title, context);
            setGeneratedDescription(description);
            onDescriptionGenerated(description);
        } catch (error) {
            toast({
                title: 'Failed to generate description',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedDescription);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: 'Copied to clipboard',
                status: 'success',
                duration: 1000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to copy',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <div>
            <HStack mb={2}>
                <Button
                    leftIcon={<FaMagic />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    isLoading={loading}
                    loadingText="Generating..."
                    isDisabled={!title.trim()}
                >
                    Generate AI Description
                </Button>
                
                {generatedDescription && (
                    <Tooltip label="Copy description">
                        <IconButton
                            icon={copied ? <FaCheck /> : <FaCopy />}
                            size="sm"
                            variant="ghost"
                            colorScheme={copied ? "green" : "gray"}
                            onClick={copyToClipboard}
                        />
                    </Tooltip>
                )}
            </HStack>

            {generatedDescription && (
                <Textarea
                    value={generatedDescription}
                    readOnly
                    placeholder="AI-generated description will appear here..."
                    size="sm"
                    mb={2}
                    bg="blue.50"
                    borderColor="blue.200"
                    _focus={{
                        borderColor: "blue.300",
                        boxShadow: "0 0 0 1px blue.300"
                    }}
                />
            )}
        </div>
    );
}

export default AIDescriptionGenerator;
