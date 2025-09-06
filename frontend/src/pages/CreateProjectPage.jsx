import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { createProject, searchUsers } from '../api/apiService.js';
import Sidebar from '../components/sidebar.jsx';

// Reusable Icon Component
const Icon = ({ path, className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d={path} /></svg> );

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // State for the form data, matching your detailed UI
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        tags: [],
        projectManager: "",
        deadline: "",
        priority: "Low",
        imageUrl: "", // Using imageUrl to match the backend
    });

    // State for the dynamic member search
    const [memberSearch, setMemberSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState('');
    
    // This will hold all potential managers (project owner + selected members)
    const [potentialManagers, setPotentialManagers] = useState([]);

    // Debounced search for members when user types
    useEffect(() => {
        if (memberSearch.trim() === '') {
            setSearchResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await searchUsers(memberSearch);
                const newResults = res.data.filter(
                    foundUser => ![user._id, ...selectedMembers.map(m => m._id)].includes(foundUser._id)
                );
                setSearchResults(newResults);
            } catch (err) { console.error("Failed to search users", err); }
        }, 300); // 300ms delay
        return () => clearTimeout(delayDebounceFn);
    }, [memberSearch, selectedMembers, user._id]);

    // Update the list of potential project managers whenever the team changes
    useEffect(() => {
        const managers = [user, ...selectedMembers];
        setPotentialManagers(managers);
        // If the current PM is removed from members, reset the PM field
        if(formData.projectManager && !managers.some(m => m._id === formData.projectManager)) {
            setFormData(prev => ({...prev, projectManager: ''}));
        }
    }, [selectedMembers, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTagToggle = (tagValue) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagValue)
                ? prev.tags.filter(tag => tag !== tagValue)
                : [...prev.tags, tagValue]
        }));
    };
    
    const addMember = (member) => {
        setSelectedMembers([...selectedMembers, member]);
        setMemberSearch(''); // Clear search input
        setSearchResults([]); // Clear search results
    };

    const removeMember = (memberId) => {
        setSelectedMembers(selectedMembers.filter(m => m._id !== memberId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const memberIds = selectedMembers.map(m => m._id);
            // We send the form data and the array of member IDs as a JSON object
            await createProject({ ...formData, members: memberIds });
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating project:", err);
            setError("Failed to create project. Please check the details and try again.");
        }
    };

    const allTags = ["Frontend", "Backend", "Full-Stack", "UI/UX", "API", "Database", "Mobile", "Web", "Design", "Marketing", "Sales"];

    return (
        <div className="flex h-screen font-sans bg-gray-950 text-gray-300">
            <Sidebar />
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <header className="flex items-center justify-between mb-8">
                        <div className="flex items-center text-sm text-gray-400">
                            <Link to="/dashboard" className="hover:text-white">Projects</Link>
                            <span className="mx-2">&gt;</span>
                            <span className="text-white font-semibold">New Project</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => navigate(-1)} className="text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-800">Discard</button>
                            <button type="submit" className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700">Save Project</button>
                        </div>
                    </header>

                    {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg mb-4">{error}</p>}
                    
                    <div className="space-y-6 bg-gray-900 p-6 rounded-xl border border-gray-800">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm mb-1">Project Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" required />
                        </div>
                        
                        {/* Tags */}
                        <div>
                            <label className="block text-sm mb-2">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map((tag) => (
                                    <button type="button" key={tag} onClick={() => handleTagToggle(tag)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${formData.tags.includes(tag) ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-emerald-500'}`}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Team Members */}
                        <div>
                            <label className="block text-sm mb-1">Team Members</label>
                            <div className="relative">
                                <input type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search by email to add..." className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                                        {searchResults.map(foundUser => (
                                            <div key={foundUser._id} onClick={() => addMember(foundUser)} className="px-3 py-2 hover:bg-gray-700 cursor-pointer"><p className="font-semibold">{foundUser.name}</p><p className="text-xs text-gray-400">{foundUser.email}</p></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <div className="bg-emerald-800 text-white rounded-full px-3 py-1 flex items-center gap-2 text-sm"><span>{user.name} (Owner)</span></div>
                                {selectedMembers.map(member => (
                                    <div key={member._id} className="bg-gray-700 rounded-full px-3 py-1 flex items-center gap-2 text-sm">
                                        <span>{member.name}</span>
                                        <button type="button" onClick={() => removeMember(member._id)} className="text-gray-400 hover:text-white">&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Manager */}
                        <div>
                            <label className="block text-sm mb-1">Project Manager</label>
                            <select name="projectManager" value={formData.projectManager} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white">
                                <option value="">Select a Manager</option>
                                {potentialManagers.map(manager => (
                                    <option key={manager._id} value={manager._id}>{manager.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Deadline & Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm mb-1">Deadline</label>
                                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Priority</label>
                                <div className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-lg p-2.5">
                                    {["Low", "Medium", "High"].map((level) => (
                                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="priority" value={level} checked={formData.priority === level} onChange={handleChange} className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 focus:ring-emerald-500" />
                                            {level}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm mb-1">Project Image URL</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/project-image.png" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
                        </div>
                        
                        {/* Description */}
                        <div>
                            <label className="block text-sm mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateProjectPage;