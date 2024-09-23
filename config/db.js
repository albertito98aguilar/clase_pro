const mysql = require('mysql');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: 'mysql.railway.internal', // Dirección IP de tu base de datos
    user: 'root', // Usuario de MySQL
    password: 'cwgHUHRHYVLpMrGGcKAwahBIxpEFDaje', // Contraseña de MySQL
    database: 'railway', // Nombre de la base de datos
    port: 3306 // Puerto (opcional, 3306 es el predeterminado)
});

// Conectar a la base de datos
connection.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;
