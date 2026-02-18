import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                onLogin(data.user);
                navigate('/');
            } else {
                toast.error(data.error || "Login failed");
            }
        } catch (err) {
            toast.error("Connection error");
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100%',
            gap: '20px'
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px', letterSpacing: '2px' }}>HABIT FLOW</h1>
            <div className="main-panel" style={{
                width: '400px',
                height: 'auto',
                alignItems: 'stretch',
                padding: '40px'
            }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>LOGIN</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="email"
                        placeholder="EMAIL"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="add-btn" style={{ marginTop: '10px', width: '100%', padding: '15px' }}>
                        LOGIN
                    </button>
                    <Link to="/register" style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        marginTop: '10px'
                    }}>
                        Create an account
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
