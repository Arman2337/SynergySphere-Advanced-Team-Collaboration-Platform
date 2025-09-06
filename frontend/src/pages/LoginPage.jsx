import { useState } from 'react';
import { Link } from 'react-router-dom';
// We will create the api file in the next step
// import api from '../api/axios'; 

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This is where you would make the API call
            // const response = await api.post('/api/auth/login', formData);
            // console.log('Login successful:', response.data);
            
            // For now, we'll just log it and show an alert
            console.log('Logging in with:', formData);
            alert('Login successful! (API call is commented out)');
            
            // Handle successful login (e.g., redirect to dashboard)
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            alert('Login failed. Check the console for details.');
        }
    };

    return (
        <div className="flex h-screen w-screen bg-slate-50">
            {/* Left Side - Hero Section */}
            <div className="flex-1 bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-10 flex flex-col justify-center relative max-w-lg lg:max-w-xl">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-4">SynergySphere</h1>
                    <h2 className="text-3xl font-semibold mb-4">Welcome Back!</h2>
                    <p className="text-lg opacity-90">Log in to continue collaborating with your team and driving projects forward.</p>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="flex-1 p-10 flex flex-col justify-center items-center">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Login to your account</h1>
                    <p className="text-gray-600 mb-8">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-teal-600 hover:underline">
                            Sign up instead
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                            <input
                                type="email" id="email" name="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                required autoComplete="email" placeholder="you@company.com"
                                value={formData.email} onChange={handleInputChange}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                            <input
                                type="password" id="password" name="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                required autoComplete="current-password" placeholder="Enter your password"
                                value={formData.password} onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-sm font-semibold text-teal-600 hover:underline">Forgot password?</a>
                        </div>
                        
                        <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;