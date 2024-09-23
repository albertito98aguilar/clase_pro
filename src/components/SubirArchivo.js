import React, { useState } from 'react';
import axios from 'axios';

const SubirArchivo = () => {
    const [archivo, setArchivo] = useState(null);

    const handleArchivo = (e) => {
        setArchivo(e.target.files[0]);
    };

    const subirArchivo = async () => {
        const formData = new FormData();
        formData.append('archivo', archivo);

        const token = localStorage.getItem('token');
        const config = {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            }
        };

        try {
            const res = await axios.post('http://localhost:5000/subir-archivo', formData, config);
            alert('Archivo subido con éxito');
        } catch (error) {
            console.error('Error subiendo archivo', error);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Subir archivo</h3>
            <input type="file" onChange={handleArchivo} className="form-control" />
            <button className="btn btn-primary mt-3" onClick={subirArchivo}>Subir</button>
        </div>
    );
};

export default SubirArchivo;
