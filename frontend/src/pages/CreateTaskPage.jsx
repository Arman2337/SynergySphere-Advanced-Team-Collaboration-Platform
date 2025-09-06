import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProjectById, createTask } from '../api/apiService.js';

// Reusable Icon Component
const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const CreateTaskPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [taskData, setTaskData] = useState({
        title: '',
        assignee: '', // Will hold the user ID
        dueDate: '',
        description: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await getProjectById(projectId);
                setProject(res.data);
            } catch (err) {
                setError('Failed to load project data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await createTask({
                ...taskData,
                projectId,
                // Ensure assignee is not an empty string if unassigned
                assignee: taskData.assignee || null,
            });
            navigate(`/project/${projectId}`); // Go back to the project page on success
        } catch (err) {
            console.error("Failed to create task:", err);
            setError("Could not save the task. Please try again.");
        }
    };

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
                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white">
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
                 <form onSubmit={handleSave}>
                    <header className="flex items-center justify-between mb-8">
                        <div className="flex items-center text-sm text-gray-400">
                            <Link to="/dashboard" className="hover:text-white">Projects</Link>
                            <span className="mx-2">&gt;</span>
                            <Link to={`/project/${projectId}`} className="hover:text-white">{project?.name || '...'}</Link>
                            <span className="mx-2">&gt;</span>
                            <span className="text-white font-semibold">New Task</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => navigate(-1)} className="text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                                Discard
                            </button>
                            <button type="submit" className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                                Save
                            </button>
                        </div>
                    </header>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    
                    <div className="space-y-6 max-w-3xl">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <input type="text" id="title" name="title" value={taskData.title} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
                        </div>

                        <div>
                            <label htmlFor="assignee" className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
                            <select id="assignee" name="assignee" value={taskData.assignee} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="">Unassigned</option>
                                {project?.members?.map(member => (
                                    <option key={member._id} value={member._id}>{member.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                            <input type="text" value={project?.name || ''} className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-gray-400 cursor-not-allowed" disabled />
                        </div>
                        
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
                            <input type="date" id="dueDate" name="dueDate" value={taskData.dueDate} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                            <input type="text" id="imageUrl" name="imageUrl" value={taskData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/image.png" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <textarea id="description" name="description" value={taskData.description} onChange={handleInputChange} rows="6" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                    </div>
                 </form>
            </main>
        </div>
    );
};

export default CreateTaskPage;