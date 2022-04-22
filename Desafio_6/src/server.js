const express = require('express');

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io');

const InMemoryAPI = require('../api/InMemoryAPI.js');
const LogArchiveAPI = require('../api/LogArchiveAPI.js');

const app = express();
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

let Productos = new InMemoryAPI()
let Mensajes = new LogArchiveAPI('mensajes.json')

//--------------------------------------------
io.on('connection', async socket =>{
    console.log('Usuario conectado!');
    
    //Carga inicial de productos
    socket.emit('productos', Productos.getAll());

    // actualizacion de productos
    socket.on('update', producto => {
        Productos.save(producto)
        io.sockets.emit('productos', Productos.getAll());
    })

    socket.emit('mensajes', await Mensajes.getAll());

    // actualizacion de mensajes
    socket.on('nuevoMensaje', async mensaje => {
        mensaje.hora = new Date().toLocaleString()
        await Mensajes.save(mensaje)
        io.sockets.emit('mensajes', await Mensajes.getAll());
    })
})

//--------------------------------------------
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

