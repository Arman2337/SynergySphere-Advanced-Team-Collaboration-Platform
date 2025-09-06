import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Icon component matching your existing pattern
const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const UserProfilePage = () => {
    const { user, logout } = useAuth();
    
    // Settings state - using localStorage for persistence (you may want to integrate with backend later)
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('userSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            emailNotifications: true,
            taskReminders: true,
            projectUpdates: false,
            weeklyDigest: true,
            theme: 'dark' // Since your app uses dark theme
        };
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Handle settings toggle
    const handleSettingToggle = (settingKey) => {
        const newSettings = {
            ...settings,
            [settingKey]: !settings[settingKey]
        };
        setSettings(newSettings);
        localStorage.setItem('userSettings', JSON.stringify(newSettings));
    };

    // Handle profile edit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Here you would typically make an API call to update user profile
        console.log('Profile update:', editData);
        setIsEditing(false);
        // You might want to update the user context here
    };

    const handleEditCancel = () => {
        setEditData({
            name: user?.name || '',
            email: user?.email || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="flex h-screen font-sans bg-gray-950 text-gray-300">
            {/* Sidebar - consistent with your existing design */}
            <aside className="w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800">
                <div className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className='bg-emerald-500 p-2 rounded-lg'>
                        <Icon path="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.908l-9 5.25a.75.75 0 01-.75 0l-9-5.25a.75.75 0 00-1.06 1.06l9.5 5.5a2.25 2.25 0 002.12 0l9.5-5.5a.75.75 0 10-1.06-1.06z" fillRule="evenodd"/>
                    </span>
                    <span>SynergySphere</span>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zm12 0A2.25 2.25 0 0118 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm12 0a2.25 2.25 0 0118 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" fillRule="evenodd" />
                        <span>Projects</span>
                    </Link>
                    <Link to="/dashboard?view=tasks" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                        <Icon path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <span>My Tasks</span>
                    </Link>
                </nav>
                
                <div className="mt-auto space-y-4">
                    {/* User Profile Section */}
                    <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                        <Link to="/profile" className="flex items-center gap-3">
                            <img src={`https://placehold.co/40x40/1f2937/FFFFFF?text=${user?.name?.charAt(0).toUpperCase()}`} 
                                 alt="User Avatar" 
                                 className="w-10 h-10 rounded-full border-2 border-gray-700" />
                            <div>
                                <p className="font-semibold text-white">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </Link>
                        <button onClick={logout} title="Logout" className="text-gray-400 hover:text-white transition-colors">
                            <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H9" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Profile & Settings</h1>
                    <p className="text-gray-400">Manage your account settings and preferences</p>
                </header>

                <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                                {!isEditing && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        <Icon path="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>

                            {/* Profile Avatar */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <img 
                                        src={`https://placehold.co/80x80/1f2937/FFFFFF?text=${user?.name?.charAt(0).toUpperCase()}`}
                                        alt="Profile Avatar"
                                        className="w-20 h-20 rounded-full border-4 border-gray-700"
                                    />
                                    <button className="absolute bottom-0 right-0 bg-emerald-600 p-1.5 rounded-full hover:bg-emerald-700 transition-colors">
                                        <Icon path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                                    <p className="text-gray-400">Team Member</p>
                                </div>
                            </div>

                            {/* Profile Form */}
                            {isEditing ? (
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleEditCancel}
                                            className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Full Name</label>
                                        <p className="text-white text-lg">{user?.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Email Address</label>
                                        <p className="text-white text-lg">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Member Since</label>
                                        <p className="text-white text-lg">January 2024</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                            
                            <div className="space-y-4">
                                {/* Email Notifications */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-medium">Email Notifications</h3>
                                        <p className="text-sm text-gray-400">Receive email updates</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSettingToggle('emailNotifications')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            settings.emailNotifications ? 'bg-emerald-600' : 'bg-gray-700'
                                        }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>

                                {/* Task Reminders */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-medium">Task Reminders</h3>
                                        <p className="text-sm text-gray-400">Get notified about upcoming tasks</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSettingToggle('taskReminders')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            settings.taskReminders ? 'bg-emerald-600' : 'bg-gray-700'
                                        }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.taskReminders ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>

                                {/* Project Updates */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-medium">Project Updates</h3>
                                        <p className="text-sm text-gray-400">Updates on project progress</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSettingToggle('projectUpdates')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            settings.projectUpdates ? 'bg-emerald-600' : 'bg-gray-700'
                                        }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.projectUpdates ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>

                                {/* Weekly Digest */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-medium">Weekly Digest</h3>
                                        <p className="text-sm text-gray-400">Weekly summary of activities</p>
                                    </div>
                                    <button 
                                        onClick={() => handleSettingToggle('weeklyDigest')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            settings.weeklyDigest ? 'bg-emerald-600' : 'bg-gray-700'
                                        }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <button 
                                    onClick={logout}
                                    className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H9" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;