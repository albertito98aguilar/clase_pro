// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import SubirArchivo from './components/SubirArchivo';
import VerArchivos from './components/VerArchivos';
import AuthGuard from './components/AuthGuard'; // Importamos el AuthGuard
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    {/* Rutas públicas */}
                    <Route path="/login" component={Login} />
                    <Route path="/registro" component={Registro} />

                    {/* Rutas protegidas */}
                    <AuthGuard path="/subir-archivo" component={SubirArchivo} />
                    <AuthGuard path="/ver-archivos" component={VerArchivos} />

                    {/* Ruta por defecto */}
                    <Route exact path="/">
                        <h3>Bienvenido a la aplicación de gestión de archivos</h3>
                        <p>Por favor, inicia sesión para continuar.</p>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
