import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Tag,
} from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";
function ReadTaskModal({ isOpen, onClose }) {

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent >
                <ModalHeader>Read Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className='task-card-container'>
                        <p className='task-title'>No task selected</p>
                        <div className='task-desc-container'>
                            <p className='task-desc'>Open a task from the list to view its details here.</p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant='solid' color="white" bg='darkcyan' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ReadTaskModal;
