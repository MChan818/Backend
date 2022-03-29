const express = require('express');
const Container = require('./Container.js')

const PORT = 8080;

const app = express();

let Test = new Container('productos.txt')

app.get('/productos', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    const result = Test.read()
    res.json(result);
})

app.get('/productoRandom', (req, res)=>{
    let result = Test.read()
    let random = Math.floor(Math.random() * result.length + 1)
    res.send(result[random]);
})


const server = app.listen(PORT, () =>{
    console.log('Servidor Express HTTP en puerto 8080')
});
server.on('error', error => console.log('Error en el servidor', error));
