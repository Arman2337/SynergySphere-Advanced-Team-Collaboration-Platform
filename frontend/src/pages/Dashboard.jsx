import { useState } from 'react';
import { Link } from 'react-router-dom'; // 👈 Import the Link component

// A simple SVG icon component for reusability
const Icon = ({ path, className = "w-5 h-5", fillRule = "nonzero" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule={fillRule} d={path} />
    </svg>
);

const DashboardPage = () => {
    // Mock data for projects - you can replace this with data from your API
    const [projects, setProjects] = useState([
        { id: 1, name: 'Subtle Boar', tasks: 12, views: 10, image: 'https://placehold.co/600x400/1f2937/14b8a6?text=Project' },
        { id: 2, name: 'RD Sales', tasks: 8, views: 14, image: 'https://placehold.co/600x400/1f2937/14b8a6?text=Project' },
        { id: 3, name: 'RD Upgrade', tasks: 21, views: 12, image: 'https://placehold.co/600x400/1f2937/14b8a6?text=Project' },
    ]);

    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode as per the design

    return (
        <div className={`flex h-screen font-sans bg-gray-950 text-gray-300`}>
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800">
                <div className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className='bg-emerald-500 p-2 rounded-lg'>
                        <Icon path="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.908l-9 5.25a.75.75 0 01-.75 0l-9-5.25a.75.75 0 00-1.06 1.06l9.5 5.5a2.25 2.25 0 002.12 0l9.5-5.5a.75.75 0 10-1.06-1.06z" fillRule="evenodd"/>
                    </span>
                    <span>Company</span>
                </div>

                <nav className="flex-1 space-y-2">
                     <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-800 text-white font-semibold">
                        <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 10.5V6zm12 0A2.25 2.25 0 0118 3.75h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm12 0a2.25 2.25 0 0118 14.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" fillRule="evenodd" />
                        <span>Projects</span>
                    </a>
                </nav>

                <div className="mt-auto space-y-4">
                    <div className="bg-gray-800 rounded-full flex items-center p-1 text-gray-400">
                         <button onClick={() => setIsDarkMode(false)} className={`flex-1 p-1.5 rounded-full flex justify-center items-center`}>
                             <Icon path="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                         </button>
                         <button onClick={() => setIsDarkMode(true)} className={`flex-1 p-1.5 rounded-full flex justify-center items-center bg-gray-700 text-white`}>
                            <Icon path="M9.663 15.61A6.5 6.5 0 013.437 9.381a6.502 6.502 0 008.21 8.21 6.5 6.5 0 01-2.016-1.98zM6.5 4A6.5 6.5 0 0015.61 14.663A6.5 6.5 0 014 6.5z" />
                         </button>
                    </div>
                    <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                        <img src="https://placehold.co/40x40/1f2937/FFFFFF?text=T" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-700" />
                        <div>
                            <p className="font-semibold text-white">Test User</p>
                            <p className="text-xs text-gray-500">user@mail</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white">Projects</h1>
                        <span className="text-gray-500 font-semibold">Respectful Baboon</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 w-64 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Icon path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fillRule="evenodd"/>
                            </div>
                        </div>
                        <button className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                             <Icon path="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            <span>New Project</span>
                        </button>
                    </div>
                </header>

                <h2 className="text-xl font-semibold text-white mb-4">My Tasks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map(project => (
                        // 👇 Wrap the project card with a Link component
                        <Link to={`/project/${project.id}`} key={project.id} className="block hover:-translate-y-1 transition-transform">
                            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg h-full">
                                <img src={project.image} alt={project.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>{project.tasks} tasks</span>
                                        <span>{project.views} views</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;