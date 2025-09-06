import { useState } from 'react';

const CreateAccount = () => {
    const [password, setPassword] = useState('');

    // In a real app, you would have more robust state management
    // and form handling. This is a simplified version.

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Implement password strength logic here if needed
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        alert('Form submitted!');
    };

    return (
        <div className="container">
            {/* Left Side - Hero/Branding Section */}
            <div className="hero-section">
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

            {/* Right Side - Form Section */}
            <div className="form-section">
                <h1 className="form-title">Create your account</h1>
                <p className="form-subtitle">Get started with your team's collaboration hub in seconds</p>

                <form id="signupForm" noValidate onSubmit={handleSubmit}>
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
                            value={password}
                            onChange={handlePasswordChange}
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
                        />
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="terms" name="terms" className="checkbox" required />
                        <label htmlFor="terms" className="checkbox-label">
                            By creating an account, I agree to the
                            <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and
                            <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>
                        </label>
                    </div>
                    <button type="submit" className="submit-btn">
                        Create Account
                    </button>
                </form>
                <div className="login-link">
                    Already have an account? <a href="/login">Sign in here</a>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;