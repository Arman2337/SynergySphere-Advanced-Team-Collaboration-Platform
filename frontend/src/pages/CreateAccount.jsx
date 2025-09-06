import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Renamed from CreateAccount to match your App.jsx import
const CreateAccountPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Prepare data for the backend API (which expects a single 'name' field)
        const registrationData = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            password: formData.password
        };

        try {
            await register(registrationData);
            // Navigation on success is handled by the register function in AuthContext
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-white flex items-center justify-center font-sans p-4">
            <div className="container mx-auto flex flex-col md:flex-row max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden my-10">
                
                {/* Left Side - Hero/Branding Section */}
                <div className="w-full md:w-1/2 p-12 bg-gradient-to-b from-teal-500 to-teal-600 text-white flex flex-col justify-center">
                    <div className="hero-content">
                        <div className="text-3xl font-bold mb-4">SynergySphere</div>
                        <h2 className="text-4xl font-extrabold mb-3">Welcome to the Future of Team Collaboration</h2>
                        <p className="text-teal-100 mb-8">
                            Join thousands of teams who've transformed their workflow with our intelligent collaboration platform.
                        </p>
                        <ul className="space-y-3">
                            {['Intelligent task management', 'Real-time team communication', 'Advanced project insights', 'Cross-platform synchronization'].map(feature => (
                                <li key={feature} className="flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h1>
                    <p className="text-gray-500 mb-8">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-teal-600 hover:underline">
                             Log in
                        </Link>
                    </p>

                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                            <div className="w-full md:w-1/2 mb-4 md:mb-0">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">First name *</label>
                                <input
                                    type="text" id="firstName" name="firstName"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    required autoComplete="given-name" placeholder="John"
                                    value={formData.firstName} onChange={handleInputChange}
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">Last name *</label>
                                <input
                                    type="text" id="lastName" name="lastName"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    required autoComplete="family-name" placeholder="Doe"
                                    value={formData.lastName} onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email address *</label>
                            <input
                                type="email" id="email" name="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                required autoComplete="email" placeholder="john.doe@company.com"
                                value={formData.email} onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password *</label>
                            <input
                                type="password" id="password" name="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                required autoComplete="new-password" minLength="6"
                                placeholder="Create a strong password (min. 6 chars)"
                                value={formData.password} onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirm password *</label>
                            <input
                                type="password" id="confirmPassword" name="confirmPassword"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                required autoComplete="new-password" placeholder="Confirm your password"
                                value={formData.confirmPassword} onChange={handleInputChange}
                            />
                        </div>
                        
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300">
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAccountPage;
