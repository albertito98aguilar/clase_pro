import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Registro = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('alumno');
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [nuevoCurso, setNuevoCurso] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchCursos = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: { 'Authorization': token }
            };

            try {
                const res = await axios.get('http://localhost:5000/cursos', config);
                setCursos(res.data);
            } catch (error) {
                console.error('Error obteniendo cursos', error);
            }
        };
        fetchCursos();
    }, []);

    const handleRegistro = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { 'Authorization': token }
        };

        const cursoId = cursoSeleccionado === 'nuevo' ? nuevoCurso : cursoSeleccionado;

        try {
            await axios.post('http://localhost:5000/registro', {
                nombre, email, password, rol, curso_id: cursoId
            }, config);
            alert('Usuario registrado con éxito');
            history.push('/dashboard');
        } catch (error) {
            console.error('Error registrando usuario', error);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Registrar Usuario</h3>
            <input 
                type="text" 
                className="form-control" 
                placeholder="Nombre" 
                onChange={(e) => setNombre(e.target.value)} 
                value={nombre} 
            />
            <input 
                type="email" 
                className="form-control mt-2" 
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
            <select 
                className="form-control mt-2" 
                onChange={(e) => setRol(e.target.value)} 
                value={rol}>
                <option value="alumno">Alumno</option>
                <option value="delegado">Delegado</option>
                <option value="admin">Administrador</option>
            </select>
            <select 
                className="form-control mt-2" 
                onChange={(e) => setCursoSeleccionado(e.target.value)} 
                value={cursoSeleccionado}>
                <option value="">Selecciona un curso</option>
                {cursos.map(curso => (
                    <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                ))}
                <option value="nuevo">Crear nuevo curso</option>
            </select>

            {cursoSeleccionado === 'nuevo' && (
                <input 
                    type="text" 
                    className="form-control mt-2" 
                    placeholder="Nombre del nuevo curso" 
                    onChange={(e) => setNuevoCurso(e.target.value)} 
                    value={nuevoCurso} 
                />
            )}

            <button className="btn btn-primary mt-3" onClick={handleRegistro}>Registrar</button>
        </div>
    );
};

export default Registro;
