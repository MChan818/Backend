const express = require('express');
const Container = require('./Container.js')

const PORT = 8080;

const app = express();

let Test = new Container('productos.txt')

app.get('/productos', async (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    const result = await Test.read()
    res.json(result);
})

app.get('/productoRandom', async (req, res)=>{
    let result = await Test.read()
    let random = Math.floor(Math.random() * result.length)
    res.send(result[random]);
})


const server = app.listen(PORT, () =>{
    console.log('Servidor Express HTTP en puerto 8080')
});
server.on('error', error => console.log('Error en el servidor', error));
