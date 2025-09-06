import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/sidebar.jsx';

// Icon component matching your existing pattern
const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const UserProfilePage = () => {
    const { user, logout } = useAuth();
    
    // Settings state - using localStorage for persistence
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('userSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            emailNotifications: true,
            taskReminders: true,
            projectUpdates: false,
            weeklyDigest: true,
            theme: 'dark'
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
        console.log('Profile update:', editData);
        setIsEditing(false);
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
            <Sidebar />
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

                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                            
                            <div className="space-y-4">
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