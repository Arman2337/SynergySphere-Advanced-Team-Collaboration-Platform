import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProjects, createProject, getMyTasks } from '../api/apiService.js';
import Modal from '../components/Modal.jsx';

const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const DashboardPage = () => {
    const [activeView, setActiveView] = useState('projects'); // 'projects' or 'tasks'
    const [projects, setProjects] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProjectData, setNewProjectData] = useState({ name: '', description: '' });
    const { user, logout } = useAuth();

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
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800">
                <div className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className='bg-emerald-500 p-2 rounded-lg'>
                         <Icon path="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.908l-9 5.25a.75.75 0 01-.75 0l-9-5.25a.75.75 0 00-1.06 1.06l9.5 5.5a2.25 2.25 0 002.12 0l9.5-5.5a.75.75 0 10-1.06-1.06z" fillRule="evenodd"/>
                    </span>
                    <span>SynergySphere</span>
                </div>
                {/* 👇 UPDATED NAVIGATION */}
                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveView('projects')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeView === 'projects' ? 'bg-gray-800 text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zm12 0A2.25 2.25 0 0118 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm12 0a2.25 2.25 0 0118 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" fillRule="evenodd" />
                        <span>Projects</span>
                    </button>
                    <button onClick={() => setActiveView('tasks')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeView === 'tasks' ? 'bg-gray-800 text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <span>My Tasks</span>
                    </button>
                </nav>
                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                        <div className="flex items-center gap-3">
                            <img src={`https://placehold.co/40x40/1f2937/FFFFFF?text=${user?.name?.charAt(0).toUpperCase()}`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-700" />
                            <div>
                                <p className="font-semibold text-white">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={logout} title="Logout" className="text-gray-400 hover:text-white">
                             <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H9" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                     <h1 className="text-2xl font-bold text-white">{activeView === 'projects' ? 'Projects' : 'My Tasks'}</h1>
                     {activeView === 'projects' && (
                        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                            <Icon path="M12 4.5v15m7.5-7.5h-15" />
                            <span>New Project</span>
                        </button>
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