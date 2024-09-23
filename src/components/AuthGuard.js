// src/components/AuthGuard.js

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthGuard = ({ component: Component, ...rest }) => {
    // Obtener el token de autenticación desde el almacenamiento local
    const token = localStorage.getItem('token');

    return (
        <Route 
            {...rest} 
            render={(props) => 
                // Si hay un token, renderizar el componente; si no, redirigir a la página de login
                token ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
};

export default AuthGuard;
