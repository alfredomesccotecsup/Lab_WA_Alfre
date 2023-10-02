const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'db_lab05'
});

app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.post('/save-message', function (req, res) {
    const usuario = req.body.usuario;
    const mensaje = req.body.mensaje;
    const imagen = req.body.imagen;

    const sql = 'INSERT INTO mensajes (usuario, mensaje, imagen) VALUES (?, ?, ?)';
    connection.query(sql, [usuario, mensaje, imagen], function (err, result) {
        if (err) throw err;
        console.log('Mensaje guardado en la base de datos');
        res.sendStatus(200);
    });
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('Usuario conectado');

    socket.on('chat message 1', function (msg) {
        console.log('Mensaje del chat 1:', msg);
        io.emit('chat message 1', msg);
    });

    socket.on('chat message 2', function (msg) {
        console.log('Mensaje del chat 2:', msg);
        io.emit('chat message 2', msg);
    });

    socket.on('disconnect', function () {
        console.log('Usuario desconectado');
    });
});

http.listen(3000, function () {
    console.log('Servidor escuchando en http://localhost:3000');
});