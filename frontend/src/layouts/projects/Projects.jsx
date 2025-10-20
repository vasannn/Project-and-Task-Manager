import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./projects.css"
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
import AddProjectModal from './modals/AddProject';
import ReadProjectModal from './modals/ReadProject';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';


function Projects() {
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isReadProjectModalOpen, setIsReadProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const openAddProjectModal = () => {
    setIsAddProjectModalOpen(true);
  };
  const openReadProjectModal = () => {
    setIsReadProjectModalOpen(true);
  };

  const closeAddProjectModal = () => {
    setIsAddProjectModalOpen(false);
  };
  const closeReadProjectModal = () => {
    setIsReadProjectModalOpen(false);
  };

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Status buckets per schema: 'On Hold', 'In Progress', 'Testing', 'Completed'
  const totalProjects = projects.length;
  const onHoldProjects = projects.filter(p => !p.status || p.status === 'On Hold');
  const inProgressProjects = projects.filter(p => p.status === 'In Progress');
  const testingProjects = projects.filter(p => p.status === 'Testing');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  const renderProjectCard = (project, section) => {
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
        case 'Completed':
          return 'green';
        case 'In Progress':
          return 'blue';
        case 'Testing':
          return 'orange';
        default:
          return 'red';
      }
    };

    return (
      <div key={project._id} className='task-card-container'>
        <p className='task-title'>{project.title}</p>
        <div className='task-desc-container'>
          <p className='task-desc'>{project.description}</p>
        </div>
        <div className='task-card-footer-container'>
          <div>
            {section === 'todo' ? (
              <Tag size='lg' colorScheme={getPriorityColor(project.priority)} borderRadius='full'>
                <p className='tag-text'>{project.priority}</p>
              </Tag>
            ) : (
              <Tag size='lg' colorScheme={getStatusColor(project.status)} borderRadius='full'>
                <p className='tag-text'>{project.status || 'On Hold'}</p>
              </Tag>
            )}
          </div>
          <div>
            <div className='task-read' onClick={openReadProjectModal}>
              <IoReaderOutline className='read-icon' />
            </div>
          </div>
          {(section === 'in-progress' || section === 'testing') && (
            <div>
              <CircularProgress value={40} color={section === 'in-progress' ? '#0225FF' : 'orange'}>
                <CircularProgressLabel>40%</CircularProgressLabel>
              </CircularProgress>
            </div>
          )}
        </div>
        <p className='created'>Created on: {formatDate(project.startDate)}</p>
      </div>
    );
  };

  return (
    <>
      <AddProjectModal isOpen={isAddProjectModalOpen} onClose={closeAddProjectModal} />
      <ReadProjectModal isOpen={isReadProjectModalOpen} onClose={closeReadProjectModal} />
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav /></div>
        <div className='app-main-right-container'>
          <Navbar />
          <div className='dashboard-main-container'>
            <div className='dashboard-main-left-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Projects Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>{totalProjects}</p>
                      <p className='stats-text'>Total Projects</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>{completedProjects.length}</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>{inProgressProjects.length}</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>{onHoldProjects.length + testingProjects.length}</p>
                      <p className='stats-text'>Pending/Testing</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={pending} alt="pending" />
                    <p className='todo-text'>To-Do Projects</p>
                  </div>
                  <button className='table-btn-task' onClick={openAddProjectModal}><IoMdAdd />Add Project</button>

                </div>
                {onHoldProjects.length > 0 ? (
                  onHoldProjects.map(project => renderProjectCard(project, 'todo'))
                ) : (
                  <div className='task-card-container'>
                    <p className='task-title'>No to-do projects</p>
                    <p className='task-desc'>Create a new project using the "Add Project" button above.</p>
                  </div>
                )}
              </div>
            </div>

            <div className='dashboard-main-right-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Projects Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress value={totalProjects > 0 ? (completedProjects.length / totalProjects) * 100 : 0} color='#05A301' size={'100px'}>
                      <CircularProgressLabel>{totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Completed</p>
                  </div>
                  <div>
                    <CircularProgress value={totalProjects > 0 ? (inProgressProjects.length / totalProjects) * 100 : 0} color='#0225FF' size={'100px'}>
                      <CircularProgressLabel>{totalProjects > 0 ? Math.round((inProgressProjects.length / totalProjects) * 100) : 0}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Progress</p>

                  </div>
                  <div>
                    <CircularProgress value={totalProjects > 0 ? (testingProjects.length / totalProjects) * 100 : 0} color='orange' size={'100px'}>
                      <CircularProgressLabel>{totalProjects > 0 ? Math.round((testingProjects.length / totalProjects) * 100) : 0}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='testing'>Testing</p>

                  </div>
                  <div>
                    <CircularProgress value={totalProjects > 0 ? (onHoldProjects.length / totalProjects) * 100 : 0} color='#F21E1E' size={'100px'}>
                      <CircularProgressLabel>{totalProjects > 0 ? Math.round((onHoldProjects.length / totalProjects) * 100) : 0}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Pending</p>
                  </div>
                </div>
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={book} alt="Book" />
                    <p className='todo-text'>In Progress Projects</p>
                  </div>
                </div>
                {inProgressProjects.length > 0 ? (
                  inProgressProjects.map(project => renderProjectCard(project, 'in-progress'))
                ) : (
                  <div className='task-card-container'>
                    <p className='task-title'>No in-progress projects</p>
                    <p className='task-desc'>Projects marked as In Progress will appear here.</p>
                  </div>
                )}
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={book} alt="Book" />
                    <p className='todo-text'>Testing Projects</p>
                  </div>
                </div>
                {testingProjects.length > 0 ? (
                  testingProjects.map(project => renderProjectCard(project, 'testing'))
                ) : (
                  <div className='task-card-container'>
                    <p className='task-title'>No testing projects</p>
                    <p className='task-desc'>Projects in Testing will appear here.</p>
                  </div>
                )}
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={book} alt="Book" />
                    <p className='todo-text'>Completed Projects</p>
                  </div>
                </div>
                {completedProjects.length > 0 ? (
                  completedProjects.map(project => renderProjectCard(project, 'completed'))
                ) : (
                  <div className='task-card-container'>
                    <p className='task-title'>No completed projects</p>
                    <p className='task-desc'>Completed projects will appear here.</p>
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

export default Projects