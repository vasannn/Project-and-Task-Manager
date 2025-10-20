import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./tasks.css"
import pending from '../../assets/tasks/Pending.png';
import complete from '../../assets/tasks/complete.png';
import book from '../../assets/tasks/Book.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { IoReaderOutline } from "react-icons/io5";
import { FcStatistics } from "react-icons/fc";
import Navbar from '../../components/navbar/Navbar'
import {
    Tag,
} from '@chakra-ui/react'
import AddTaskModal from './modals/AddTask';
import ReadTaskModal from './modals/ReadTask';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';
import AITaskInsights from '../../components/ai/AITaskInsights';

function Tasks() {
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isReadTaskModalOpen, setIsReadTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    
    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };
    const openReadTaskModal = () => {
        setIsReadTaskModalOpen(true);
    };

    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };
    const closeReadTaskModal = () => {
        setIsReadTaskModalOpen(false);
    };

    // Fetch tasks for AI analysis
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Filter tasks by status (assuming we'll add status field later)
    const pendingTasks = tasks.filter(task => !task.status || task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    // Render task card component
    const renderTaskCard = (task, status = 'pending') => {
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

        const getStatusColor = (status) => {
            switch (status) {
                case 'completed':
                    return 'green';
                case 'in-progress':
                    return 'blue';
                default:
                    return 'red';
            }
        };

        return (
            <div key={task._id} className='task-card-container'>
                <p className='task-title'>{task.title}</p>
                <div className='task-desc-container'>
                    <p className='task-desc'>{task.description}</p>
                </div>
                <div className='task-card-footer-container'>
                    <div>
                        <Tag size='lg' colorScheme={getPriorityColor(task.priority)} borderRadius='full'>
                            <p className='tag-text'>{task.priority}</p>
                        </Tag>
                    </div>
                    <div>
                        <div className='task-read' onClick={openReadTaskModal}>
                            <IoReaderOutline className='read-icon' />
                        </div>
                    </div>
                    {status === 'in-progress' && (
                        <div>
                            <CircularProgress value={40} color='#0225FF'>
                                <CircularProgressLabel>40%</CircularProgressLabel>
                            </CircularProgress>
                        </div>
                    )}
                </div>
                <p className='created'>Created on: {formatDate(task.startDate)}</p>
            </div>
        );
    };
    return (
        <>
            <AddTaskModal isOpen={isAddTaskModalOpen} onClose={closeAddTaskModal} />
            <ReadTaskModal isOpen={isReadTaskModalOpen} onClose={closeReadTaskModal} />
            <div className='app-main-container'>
                <div className='app-main-left-container'><Sidenav /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='dashboard-main-container'>
                        <div className='dashboard-main-left-container'>
                            <div className='task-status-card-container'>
                                <div className='add-task-inner-div'>
                                    <FcStatistics className='task-stats' />
                                    <p className='todo-text'>Tasks Statistics</p>
                                </div>
                                <div className='stat-first-row'>
                                    <div className='stats-container container-bg1'>
                                        <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                                        <div>
                                            <p className='stats-num'>{tasks.length}</p>
                                            <p className='stats-text'>Total Task</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg4'>
                                        <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                                        <div>
                                            <p className='stats-num'>{completedTasks.length}</p>
                                            <p className='stats-text'>Completed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='stat-second-row'>
                                    <div className='stats-container container-bg2'>
                                        <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                                        <div>
                                            <p className='stats-num'>{inProgressTasks.length}</p>
                                            <p className='stats-text'>In Progress</p>
                                        </div>
                                    </div>
                                    <div className='stats-container container-bg3'>
                                        <img className='stats-icon' src={totalpending} alt="totalpending" />
                                        <div>
                                            <p className='stats-num'>{pendingTasks.length}</p>
                                            <p className='stats-text'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='add-task-main-container'>
                                <div className='add-task-main-div'>
                                    <div className='add-task-inner-div'>
                                        <img src={pending} alt="pending" />
                                        <p className='todo-text'>To-Do Tasks</p>
                                    </div>
                                    <button className='table-btn-task' onClick={openAddTaskModal}><IoMdAdd />Add Task</button>
                                </div>
                                {/* Tasks will be dynamically loaded here */}
                                {pendingTasks.length > 0 ? (
                                    pendingTasks.map(task => renderTaskCard(task, 'pending'))
                                ) : (
                                    <div className='task-card-container'>
                                        <p className='task-title'>No pending tasks</p>
                                        <p className='task-desc'>Create your first task using the "Add Task" button above.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='dashboard-main-right-container'>
                            {/* AI Task Insights */}
                            <div style={{ marginBottom: '20px' }}>
                                <AITaskInsights tasks={tasks} />
                            </div>
                            
                            <div className='task-status-card-container'>
                                <div className='add-task-inner-div'>
                                    <img src={complete} alt="complete" />
                                    <p className='todo-text'>Tasks Status</p>
                                </div>
                                <div className='task-status-progress-main-container'>
                                    <div>
                                        <CircularProgress value={tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0} color='#05A301' size={'100px'}>
                                            <CircularProgressLabel>{tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</CircularProgressLabel>
                                        </CircularProgress>
                                        <p className='completed'>Completed</p>
                                    </div>
                                    <div>
                                        <CircularProgress value={tasks.length > 0 ? (inProgressTasks.length / tasks.length) * 100 : 0} color='#0225FF' size={'100px'}>
                                            <CircularProgressLabel>{tasks.length > 0 ? Math.round((inProgressTasks.length / tasks.length) * 100) : 0}%</CircularProgressLabel>
                                        </CircularProgress>
                                        <p className='progress'>In Progress</p>
                                    </div>
                                    <div>
                                        <CircularProgress value={tasks.length > 0 ? (pendingTasks.length / tasks.length) * 100 : 0} color='#F21E1E' size={'100px'}>
                                            <CircularProgressLabel>{tasks.length > 0 ? Math.round((pendingTasks.length / tasks.length) * 100) : 0}%</CircularProgressLabel>
                                        </CircularProgress>
                                        <p className='pending'>Pending</p>
                                    </div>
                                </div>
                            </div>
                            <div className='add-task-main-container'>
                                <div className='add-task-main-div'>
                                    <div className='add-task-inner-div'>
                                        <img src={book} alt="Book" />
                                        <p className='todo-text'>In Progress Tasks</p>
                                    </div>
                                </div>
                                {/* In Progress Tasks will be dynamically loaded here */}
                                {inProgressTasks.length > 0 ? (
                                    inProgressTasks.map(task => renderTaskCard(task, 'in-progress'))
                                ) : (
                                    <div className='task-card-container'>
                                        <p className='task-title'>No tasks in progress</p>
                                        <p className='task-desc'>Tasks marked as in-progress will appear here.</p>
                                    </div>
                                )}
                            </div>
                            <div className='add-task-main-container'>
                                <div className='add-task-main-div'>
                                    <div className='add-task-inner-div'>
                                        <img src={book} alt="Book" />
                                        <p className='todo-text'>Completed Tasks</p>
                                    </div>
                                </div>
                                {/* Completed Tasks will be dynamically loaded here */}
                                {completedTasks.length > 0 ? (
                                    completedTasks.map(task => renderTaskCard(task, 'completed'))
                                ) : (
                                    <div className='task-card-container'>
                                        <p className='task-title'>No completed tasks</p>
                                        <p className='task-desc'>Completed tasks will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Tasks