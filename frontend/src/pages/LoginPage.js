import React, { useState } from 'react';
import { login } from '../services/api';

const LoginPage = ({ onLoginSuccess, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            onLoginSuccess();
        } catch (err) {
            setError(err.message || 'An unknown error occurred.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <h2>Welcome Back!</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    {error && <p className="error">{error}</p>}
                    <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        Don't have an account?{' '}
                        <button type="button" onClick={onSwitchToSignUp} className="switch-form-link">
                            Sign Up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
