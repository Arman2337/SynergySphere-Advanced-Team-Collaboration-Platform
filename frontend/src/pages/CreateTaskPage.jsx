import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProjectById, createTask } from '../api/apiService.js';
import Sidebar from '../components/sidebar.jsx';

// Reusable Icon Component
const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const CreateTaskPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

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
            <Sidebar />
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