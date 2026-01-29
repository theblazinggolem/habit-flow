import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AuthCard.css';

const AuthCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);

    // Sync with URL
    useEffect(() => {
        if (location.pathname === '/register') {
            setIsRegister(true);
        } else {
            setIsRegister(false);
        }
    }, [location.pathname]);

    const toggleMode = () => {
        if (isRegister) {
            navigate('/login');
        } else {
            navigate('/register');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            window.location.href = '/dashboard/tasks';
        } catch (error) {
            console.error("Login error:", error);
            alert('Invalid credentials');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch('http://localhost:8000/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Registration failed');
            }

            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message);
        }
    };

    return (
        <div className={`auth-container ${isRegister ? 'register-mode' : ''}`}>
            {/* Forms Wrapper */}
            <div className="auth-forms">
                {/* Login Form (Left Side) */}
                <div className="form-wrapper login-wrapper">
                    <form className="auth-form" onSubmit={handleLogin}>
                        <h2>Welcome Back</h2>
                        <input name="username" className="auth-input" type="text" placeholder="Username" required />
                        <input name="password" className="auth-input" type="password" placeholder="Password" required />
                        <button className="auth-btn">LOG IN</button>
                    </form>
                </div>

                {/* Register Form (Right Side) */}
                <div className="form-wrapper register-wrapper">
                    <form className="auth-form" onSubmit={handleRegister}>
                        <h2>Create Account</h2>
                        <input name="username" className="auth-input" type="text" placeholder="Username" required />
                        <input name="email" className="auth-input" type="email" placeholder="Email" required />
                        <input name="password" className="auth-input" type="password" placeholder="Password" required />
                        <button className="auth-btn">SIGN UP</button>
                    </form>
                </div>
            </div>

            {/* Sliding Overlay */}
            <div className="auth-overlay">
                <div className="overlay-content">
                    <h2>{isRegister ? "Welcome Back!" : "Hello, Friend!"}</h2>
                    <p>{isRegister ? "To keep connected with us please login with your personal info" : "Enter your personal details and start journey with us"}</p>
                    <button className="auth-btn" style={{ background: 'transparent', border: '1px solid white', color: 'white' }} onClick={toggleMode}>
                        {isRegister ? "LOG IN" : "SIGN UP"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthCard;
