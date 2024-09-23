const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

// Middleware de autenticación JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido.');
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido.');
        req.user = decoded;
        next();
    });
};

// Roles autorizados
const authorizeRoles = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
        return res.status(403).send('No autorizado.');
    }
    next();
};

// Multer configuración para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const cursoPath = path.join(__dirname, 'uploads', `curso_${req.user.curso_id}`);
        if (!fs.existsSync(cursoPath)) {
            fs.mkdirSync(cursoPath, { recursive: true });
        }
        cb(null, cursoPath);
    },
    filename: (req, file, cb) => {
        const nombreArchivo = `${req.user.nombre}_${Date.now()}_${file.originalname}`;
        cb(null, nombreArchivo);
    }
});
const upload = multer({ storage });

// Rutas
app.post('/registro', verifyToken, authorizeRoles(['admin']), (req, res) => {
    const { nombre, email, password, rol, curso_id } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = 'INSERT INTO usuarios (nombre, email, password, rol, curso_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nombre, email, hashedPassword, rol, curso_id], (err, result) => {
        if (err) return res.status(500).send('Error registrando usuario.');
        res.status(201).send('Usuario registrado con éxito.');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).send('Error en la base de datos.');
        if (result.length === 0) return res.status(404).send('Usuario no encontrado.');

        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta.');

        const token = jwt.sign({ id: user.id, rol: user.rol, curso_id: user.curso_id, nombre: user.nombre }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({ token });
    });
});

app.get('/cursos', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM cursos';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send('Error obteniendo los cursos.');
        res.status(200).json(result);
    });
});

app.post('/cursos', verifyToken, authorizeRoles(['admin']), (req, res) => {
    const { nombre } = req.body;
    const sql = 'INSERT INTO cursos (nombre) VALUES (?)';
    db.query(sql, [nombre], (err, result) => {
        if (err) return res.status(500).send('Error creando curso.');
        res.status(201).send('Curso creado con éxito.');
    });
});

app.post('/subir-archivo', verifyToken, authorizeRoles(['alumno', 'delegado']), upload.single('archivo'), (req, res) => {
    const sql = 'INSERT INTO archivos (nombre_archivo, alumno_id, curso_id) VALUES (?, ?, ?)';
    db.query(sql, [req.file.filename, req.user.id, req.user.curso_id], (err, result) => {
        if (err) return res.status(500).send('Error subiendo archivo.');
        res.status(201).send('Archivo subido con éxito.');
    });
});

app.get('/archivos', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM archivos WHERE curso_id = ?';
    db.query(sql, [req.user.curso_id], (err, result) => {
        if (err) return res.status(500).send('Error obteniendo archivos.');
        res.status(200).json(result);
    });
});

app.delete('/archivos/:id', verifyToken, authorizeRoles(['delegado']), (req, res) => {
    const archivoId = req.params.id;
    const sql = 'DELETE FROM archivos WHERE id = ? AND curso_id = ?';
    db.query(sql, [archivoId, req.user.curso_id], (err, result) => {
        if (err) return res.status(500).send('Error eliminando archivo.');
        res.status(200).send('Archivo eliminado con éxito.');
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
