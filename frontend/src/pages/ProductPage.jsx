import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProjectById, getTasksByProject, updateTask } from '../api/apiService.js';
import Sidebar from '../components/sidebar.jsx';

// Reusable Icon Component
const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule={fillRule} d={path} /></svg> );

// Interactive Task Card Component
const TaskCard = ({ task, onStatusChange, projectId, currentUserId }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'In Progress': return { label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400' };
            case 'Done': return { label: 'Done', color: 'bg-green-500/20 text-green-400' };
            default: return { label: 'To-Do', color: 'bg-blue-500/20 text-blue-400' };
        }
    };
    
    const statusInfo = getStatusInfo(task.status);
    const isAssignee = task.assignee && task.assignee._id === currentUserId;

    const handleMenuClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuOpen(prev => !prev);
    };

    const handleStatusUpdate = (e, status) => {
        e.stopPropagation();
        e.preventDefault();
        onStatusChange(task._id, status);
        setMenuOpen(false);
    }
    
    return (
        <Link to={`/project/${projectId}/task/${task._id}/edit`} className="block bg-gray-900 border border-gray-800 rounded-xl shadow-lg mb-4 hover:-translate-y-1 transition-transform">
            {task.imageUrl && <img src={task.imageUrl} alt={task.title} className="w-full h-40 object-cover rounded-t-xl" onError={(e) => { e.target.style.display = 'none'; }} />}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                    {isAssignee && (
                        <div className="relative" ref={menuRef}>
                            <button onClick={handleMenuClick} className="text-gray-500 hover:text-white z-10 p-1 rounded-full hover:bg-gray-700">
                                <Icon path="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                                    <p className="px-4 py-2 text-xs text-gray-400">Change Status</p>
                                    <button onClick={(e) => handleStatusUpdate(e, 'To-Do')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">To-Do</button>
                                    <button onClick={(e) => handleStatusUpdate(e, 'In Progress')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">In Progress</button>
                                    <button onClick={(e) => handleStatusUpdate(e, 'Done')} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Done</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <h3 className="text-md font-semibold text-white mb-3">{task.title}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                    {task.assignee && <img src={`https://placehold.co/24x24/1f2937/FFFFFF?text=${task.assignee.name.charAt(0).toUpperCase()}`} alt={task.assignee.name} title={task.assignee.name} className="w-6 h-6 rounded-full border-2 border-gray-700" />}
                </div>
            </div>
        </Link>
    );
};

// Column Component for Tasks
const TaskColumn = ({ title, tasks, color, onStatusChange, projectId, currentUserId }) => (
    <div className="bg-gray-950/50 rounded-xl p-4 w-full h-full">
        <h3 className={`text-lg font-bold mb-4 border-b-2 pb-2 ${color}`}>{title} ({tasks.length})</h3>
        <div className="h-full overflow-y-auto">
            {tasks.map(task => <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} projectId={projectId} currentUserId={currentUserId} />)}
        </div>
    </div>
);

// Main Project Detail Page Component
const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const { user, logout } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);
            const [projectRes, tasksRes] = await Promise.all([getProjectById(projectId), getTasksByProject(projectId)]);
            setProject(projectRes.data);
            setTasks(tasksRes.data);
        } catch (err) { console.error("Failed to fetch project data", err); } 
        finally { setLoading(false); }
    }, [projectId]);

    useEffect(() => { fetchProjectData(); }, [fetchProjectData]);

    const handleStatusChange = async (taskId, newStatus) => {
        const originalTasks = [...tasks];
        setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try {
            await updateTask(taskId, { status: newStatus });
        } catch (error) {
            console.error("Failed to update task status", error);
            setTasks(originalTasks);
            // Show error message to user
            if (error.response?.status === 403) {
                alert('Only the assignee can update task status');
            } else {
                alert('Failed to update task status. Please try again.');
            }
        }
    };

    if (loading) return <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">Loading Project...</div>;

    const todoTasks = tasks.filter(t => t.status === 'To-Do');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const doneTasks = tasks.filter(t => t.status === 'Done');

    return (
        <div className={`flex h-screen font-sans bg-gray-950 text-gray-300`}>
            <Sidebar />
            {/* 👇 SIDEBAR IS NOW INCLUDED */}
            {/* <aside className="w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800 flex-shrink-0">
                 <div className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className='bg-emerald-500 p-2 rounded-lg'>
                        <Icon path="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.908l-9 5.25a.75.75 0 01-.75 0l-9-5.25a.75.75 0 00-1.06 1.06l9.5 5.5a2.25 2.25 0 002.12 0l9.5-5.5a.75.75 0 10-1.06-1.06z" fillRule="evenodd"/>
                    </span>
                    <span>SynergySphere</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white font-semibold">
                        <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zm12 0A2.25 2.25 0 0118 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm12 0a2.25 2.25 0 0118 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" fillRule="evenodd" />
                        <span>Projects</span>
                    </Link>
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
            </aside> */}
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto flex flex-col">
                 <header className="flex items-center justify-between mb-8 flex-shrink-0">
                    <div className="flex items-center text-sm text-gray-400">
                        <Link to="/dashboard" className="hover:text-white">Projects</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-white font-semibold">{project?.name}</span>
                    </div>
                    <Link to={`/project/${projectId}/new-task`} className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
                        <Icon path="M12 4.5v15m7.5-7.5h-15" />
                        <span>New Task</span>
                    </Link>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                    <TaskColumn title="To-Do" tasks={todoTasks} color="border-blue-500" onStatusChange={handleStatusChange} projectId={projectId} currentUserId={user?._id} />
                    <TaskColumn title="In Progress" tasks={inProgressTasks} color="border-yellow-500" onStatusChange={handleStatusChange} projectId={projectId} currentUserId={user?._id} />
                    <TaskColumn title="Done" tasks={doneTasks} color="border-green-500" onStatusChange={handleStatusChange} projectId={projectId} currentUserId={user?._id} />
                 </div>
            </main>
        </div>
    );
};

export default ProjectDetailPage;