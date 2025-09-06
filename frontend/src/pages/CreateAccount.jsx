import { useState } from 'react';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!termsAccepted) {
            alert('Please accept the Terms of Service and Privacy Policy');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        alert('Account created successfully!');
    };

    return (
        <div className="container">
            {/* Left Side - Hero/Branding Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="logo">SynergySphere</div>
                    <h2 className="hero-title">Welcome to the Future of Team Collaboration</h2>
                    <p className="hero-subtitle">
                        Join thousands of teams who've transformed their workflow with our intelligent collaboration platform.
                    </p>
                    <ul className="features-list">
                        <li>Intelligent task management</li>
                        <li>Real-time team communication</li>
                        <li>Advanced project insights</li>
                        <li>Cross-platform synchronization</li>
                    </ul>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="form-section">
                <h1 className="form-title">Create your account</h1>
                <p className="form-subtitle">Get started with your team's collaboration hub in seconds</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="firstName">First name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="form-input"
                                required
                                autoComplete="given-name"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="lastName">Last name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="form-input"
                                required
                                autoComplete="family-name"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            required
                            autoComplete="email"
                            placeholder="john.doe@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            required
                            autoComplete="new-password"
                            minLength="8"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-input"
                            required
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="checkbox-group">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            name="terms" 
                            className="checkbox" 
                            required 
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <label htmlFor="terms" className="checkbox-label">
                            By creating an account, I agree to the{' '}
                            <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and{' '}
                            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" className="submit-btn">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;