import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProjectById, getTaskById, updateTask } from '../api/apiService.js';

// Reusable Icon Component
const Icon = ({ path, className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d={path} /></svg> );

const EditTaskPage = () => {
    const { projectId, taskId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Get user and logout for the sidebar
    const [project, setProject] = useState(null);
    const [taskData, setTaskData] = useState({ title: '', description: '', assignee: '', dueDate: '', imageUrl: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, taskRes] = await Promise.all([
                    getProjectById(projectId),
                    getTaskById(taskId)
                ]);
                setProject(projectRes.data);
                const fetchedTask = taskRes.data;
                setTaskData({
                    title: fetchedTask.title || '',
                    description: fetchedTask.description || '',
                    assignee: fetchedTask.assignee?._id || '',
                    dueDate: fetchedTask.dueDate ? new Date(fetchedTask.dueDate).toISOString().split('T')[0] : '',
                    imageUrl: fetchedTask.imageUrl || ''
                });
            } catch (err) {
                setError('Failed to load task data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId, taskId]);

    const handleInputChange = (e) => {
        setTaskData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateTask(taskId, {
                ...taskData,
                assignee: taskData.assignee || null,
            });
            navigate(`/project/${projectId}`);
        } catch (err) {
            setError("Could not update the task. Please try again.");
        }
    };

    if (loading) return <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">Loading Task...</div>;

    return (
        <div className={`flex h-screen font-sans bg-gray-950 text-gray-300`}>
            {/* 👇 SIDEBAR IS NOW INCLUDED */}
            <aside className="w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800 flex-shrink-0">
                 <div className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className='bg-emerald-500 p-2 rounded-lg'>
                        <Icon path="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.908l-9 5.25a.75.75 0 01-.75 0l-9-5.25a.75.75 0 00-1.06 1.06l9.5 5.5a2.25 2.25 0 002.12 0l9.5-5.5a.75.75 0 10-1.06-1.06z" />
                    </span>
                    <span>SynergySphere</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white font-semibold">
                        <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zm12 0A2.25 2.25 0 0118 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm12 0a2.25 2.25 0 0118 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" />
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
            </aside>
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                <form onSubmit={handleSave}>
                    <header className="flex items-center justify-between mb-8">
                        <div className="flex items-center text-sm text-gray-400">
                            <Link to="/dashboard" className="hover:text-white">Projects</Link>
                            <span className="mx-2">&gt;</span>
                            <Link to={`/project/${projectId}`} className="hover:text-white">{project?.name || '...'}</Link>
                            <span className="mx-2">&gt;</span>
                            <span className="text-white font-semibold truncate max-w-xs">{taskData.title || 'Edit Task'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => navigate(-1)} className="text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-800">Discard</button>
                            <button type="submit" className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700">Save Changes</button>
                        </div>
                    </header>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="space-y-6 max-w-3xl">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <input type="text" id="title" name="title" value={taskData.title} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" required />
                        </div>
                         <div>
                            <label htmlFor="assignee" className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
                            <select id="assignee" name="assignee" value={taskData.assignee} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white">
                                <option value="">Unassigned</option>
                                {project?.members?.map(member => ( <option key={member._id} value={member._id}>{member.name}</option> ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
                            <input type="date" id="dueDate" name="dueDate" value={taskData.dueDate} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                            <input type="text" id="imageUrl" name="imageUrl" value={taskData.imageUrl} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <textarea id="description" name="description" value={taskData.description} onChange={handleInputChange} rows="6" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};
export default EditTaskPage;