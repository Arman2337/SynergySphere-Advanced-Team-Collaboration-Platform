import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProjectById, getTasksByProject, createTask } from '../api/apiService.js';
import Modal from '../components/Modal.jsx';

// A simple SVG icon component for reusability
const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const ProjectPage = () => {
    const { projectId } = useParams();
    const { user } = useAuth(); // Get user info for the sidebar

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState({ title: '', description: '' });

    // Fetch data from the backend
    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);
            const [projectRes, tasksRes] = await Promise.all([
                getProjectById(projectId),
                getTasksByProject(projectId)
            ]);
            setProject(projectRes.data);
            setTasks(tasksRes.data);
            setError('');
        } catch (err) {
            console.error("Failed to fetch project data:", err);
            setError("Could not load project details.");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const handleFormChange = (e) => {
        setNewTaskData({ ...newTaskData, [e.target.name]: e.target.value });
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await createTask({ ...newTaskData, projectId });
            setTasks([...tasks, res.data]); // Add new task to the list
            setIsModalOpen(false);
            setNewTaskData({ title: '', description: '' });
        } catch (err) {
            console.error("Failed to create task:", err);
            // Optionally set an error state for the modal
        }
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'To-Do': return 'bg-blue-500/20 text-blue-400';
            case 'In Progress': return 'bg-yellow-500/20 text-yellow-400';
            case 'Done': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className={`flex h-screen font-sans bg-gray-950 text-gray-300`}>
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800">
                <div className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className='bg-emerald-500 p-2 rounded-lg'>
                        <Icon path="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.908l-9 5.25a.75.75 0 01-.75 0l-9-5.25a.75.75 0 00-1.06 1.06l9.5 5.5a2.25 2.25 0 002.12 0l9.5-5.5a.75.75 0 10-1.06-1.06z" fillRule="evenodd" />
                    </span>
                    <span>SynergySphere</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-800 text-white font-semibold">
                        <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zm12 0A2.25 2.25 0 0118 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm12 0a2.25 2.25 0 0118 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" fillRule="evenodd" />
                        <span>Projects</span>
                    </Link>
                </nav>
                <div className="mt-auto flex items-center gap-3 border-t border-gray-800 pt-4">
                    <img src={`https://placehold.co/40x40/1f2937/FFFFFF?text=${user?.name?.charAt(0).toUpperCase()}`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-700" />
                    <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center text-sm text-gray-400">
                        <Link to="/dashboard" className="hover:text-white">Projects</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-white font-semibold">{project ? project.name : 'Loading...'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 w-64 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Icon path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fillRule="evenodd" />
                            </div>
                        </div>
                        <Link to={`/project/${projectId}/new-task`} className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                            <Icon path="M12 4.5v15m7.5-7.5h-15" />
                            <span>New Task</span>
                        </Link>
                    </div>
                </header>

                {loading && <p>Loading tasks...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tasks.map(task => (
                            <div key={task._id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
                                <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-3xl font-bold" style={{ color: '#4ade80' }}>TASK</div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                        {task.assignee && (
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white">
                                                    {task.assignee.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-md font-semibold text-white mb-2">{task.title}</h3>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a New Task">
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
                        <input type="text" id="title" name="title" value={newTaskData.title} onChange={handleFormChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea id="description" name="description" value={newTaskData.description} onChange={handleFormChange} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Create Task</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectPage;