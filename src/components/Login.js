import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', res.data.token);
            alert('Inicio de sesión exitoso');
            history.push('/dashboard');
        } catch (error) {
            console.error('Error en el login', error);
            alert('Credenciales incorrectas');
        }
    };

    return (
        <div className="container mt-5">
            <h3>Iniciar Sesión</h3>
            <input 
                type="email" 
                className="form-control" 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
            />
            <input 
                type="password" 
                className="form-control mt-2" 
                placeholder="Contraseña" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
            />
            <button className="btn btn-primary mt-3" onClick={handleLogin}>Ingresar</button>
        </div>
    );
};

export default Login;
