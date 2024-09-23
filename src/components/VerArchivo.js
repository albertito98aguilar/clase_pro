import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerArchivos = () => {
    const [archivos, setArchivos] = useState([]);
    
    useEffect(() => {
        const fetchArchivos = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: { 'Authorization': token }
            };

            try {
                const res = await axios.get('http://localhost:5000/archivos', config);
                setArchivos(res.data);
            } catch (error) {
                console.error('Error obteniendo archivos', error);
            }
        };
        fetchArchivos();
    }, []);

    const eliminarArchivo = async (id) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { 'Authorization': token }
        };

        try {
            await axios.delete(`http://localhost:5000/archivos/${id}`, config);
            setArchivos(archivos.filter(archivo => archivo.id !== id));
            alert('Archivo eliminado con éxito');
        } catch (error) {
            console.error('Error eliminando archivo', error);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Archivos del Curso</h3>
            <ul className="list-group">
                {archivos.map(archivo => (
                    <li key={archivo.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {archivo.nombre_archivo}
                        <button className="btn btn-danger btn-sm" onClick={() => eliminarArchivo(archivo.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VerArchivos;
