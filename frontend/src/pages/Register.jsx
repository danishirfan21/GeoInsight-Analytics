import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, MenuItem } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Viewer');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { username, email, password, role });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign up</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal" required fullWidth label="Username"
                        value={username} onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Email Address"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Password" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        select margin="normal" fullWidth label="Role"
                        value={role} onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="Viewer">Viewer</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                    </TextField>
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                    <Link component={RouterLink} to="/login" variant="body2">
                        {"Already have an account? Sign In"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}
