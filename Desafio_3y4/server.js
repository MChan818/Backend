const Container = require('./Container.js')

const express = require('express');
const {Router} = express;
const PORT = 8080;

const app = express();

app.use(express.static('public'));

let Test = new Container('productos.txt')

const routerProductos = new Router();
routerProductos.use(express.json());
routerProductos.use(express.urlencoded({extended: true}));
//DEVUELVE TODO LOS PRODUCTOS
routerProductos.get('/productos', async (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    const result = await Test.read()
    res.json(result);
})
//DEVUELVE PRODUCTO POR ID
routerProductos.get('/productos/:id', async (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    const id = req.params.id
    const result = await Test.read()
    res.json(result[id-1]);
})
//AGREGA UN PRODUCTO A PRODUCTOS.TXT
let productos = [];
routerProductos.post('/productos', async (req, res)=>{
    const message = req.body;
    productos.push(message)
    await Test.save(message);
    res.send({body: message, productos: productos});
})
//MODIFICA UN PRODUCTO POR ID
routerProductos.put('/productos/:id', async (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    //Guardo en result una copia de productos.txt
    const result = await Test.read()
    const id = req.params.id //Guardo el ID del producto que entra como parametro
    const message = req.body; //Guardo el body (modificado)
    result[id-1].title = message.title; //Modifico el item correspondiente
    result[id-1].price = message.price; //Modifico el item correspondiente
    await Test.replace(result); //Reemplazo el JSON entero con el item modificado
    res.json(result);
})
//BORRA UN PRODUCTO POR ID
routerProductos.delete('/productos/:id', async (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    const id = req.params.id;
    await Test.deleteById(parseInt(id));
    res.json(`El Item ${id} se ha borrado`);
})
//DEVUELVE PRODUCTO RANDOM
app.get('/productoRandom', async (req, res)=>{
    let result = await Test.read()
    let random = Math.floor(Math.random() * result.length)
    res.send(result[random]);
})

app.use('/api',routerProductos);

const server = app.listen(PORT, () =>{
    console.log('Servidor Express HTTP en puerto 8080')
});
server.on('error', error => console.log('Error en el servidor', error));
