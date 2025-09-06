import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData);
            // Navigation on success is handled by the login function in AuthContext
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex h-screen w-screen bg-slate-50 font-sans">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-12 flex-col justify-center relative">
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

                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}

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

