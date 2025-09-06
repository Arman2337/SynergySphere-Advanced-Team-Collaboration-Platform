import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProjects, createProject, getMyTasks } from '../api/apiService.js';
import Modal from '../components/Modal.jsx';
import Sidebar from '../components/sidebar.jsx';

const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const DashboardPage = () => {
    const location = useLocation();
    const [activeView, setActiveView] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProjectData, setNewProjectData] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [projectsRes, tasksRes] = await Promise.all([getProjects(), getMyTasks()]);
                setProjects(projectsRes.data);
                setMyTasks(tasksRes.data);
                setError('');
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError('Could not load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('view') === 'tasks') {
            setActiveView('tasks');
        } else {
            setActiveView('projects');
        }
    }, [location.search]);

    const handleFormChange = (e) => {
        setNewProjectData({ ...newProjectData, [e.target.name]: e.target.value });
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const res = await createProject(newProjectData);
            setProjects([res.data, ...projects]);
            setIsModalOpen(false);
            setNewProjectData({ name: '', description: '' });
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };

    const renderProjects = () => (
        <section>
            <h2 className="text-xl font-semibold text-white mb-4">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map(project => (
                    <Link to={`/project/${project._id}`} key={project._id} className="block hover:-translate-y-1 transition-transform">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                            <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-emerald-500 text-3xl font-bold">
                                {project.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <h3 className="text-lg font-semibold text-white mb-2 truncate">{project.name}</h3>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>{project.members.length} member(s)</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                {projects.length === 0 && <p className='text-gray-400 col-span-full'>No projects yet. Click "New Project" to get started!</p>}
            </div>
        </section>
    );

    const renderMyTasks = () => (
        <section>
            <h2 className="text-xl font-semibold text-white mb-4">My Tasks</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="space-y-3">
                    {myTasks.length > 0 ? myTasks.map(task => (
                        <Link to={`/project/${task.project._id}`} key={task._id} className="block p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">{task.title}</p>
                                    <p className="text-xs text-emerald-400">{task.project.name}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                    task.status === 'To-Do' ? 'bg-blue-500/20 text-blue-300' :
                                    task.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-green-500/20 text-green-300'
                                }`}>
                                    {task.status}
                                </span>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-gray-500 p-3">You have no tasks assigned to you.</p>
                    )}
                </div>
            </div>
        </section>
    );

    return (
        <div className={`flex h-screen font-sans bg-gray-950 text-gray-300`}>
            <Sidebar />
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                     <h1 className="text-2xl font-bold text-white">{activeView === 'projects' ? 'Projects' : 'My Tasks'}</h1>
                     {activeView === 'projects' && (
                        <Link to="/project/new" className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                            <Icon path="M12 4.5v15m7.5-7.5h-15" />
                            <span>New Project</span>
                        </Link>
                     )}
                </header>

                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                {!loading && !error && (
                    activeView === 'projects' ? renderProjects() : renderMyTasks()
                )}
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a New Project">
                 <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                        <input type="text" id="name" name="name" value={newProjectData.name} onChange={handleFormChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea id="description" name="description" value={newProjectData.description} onChange={handleFormChange} rows="3" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Create Project</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DashboardPage;