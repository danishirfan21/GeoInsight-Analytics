import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal" required fullWidth label="Email Address"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Password" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
                    <Link component={RouterLink} to="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}
