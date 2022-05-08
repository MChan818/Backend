const express = require('express');
const {Router} = express;

const productosAPI = require('../api/ProductosAPI.js')
const carritoAPI = require('../api/CarritoAPI.js')

let productos = new productosAPI('productos.txt')
let carritos = new carritoAPI('carritos.txt')

const app = express();
app.use(express.static('public'))

const routerAPI = new Router();
routerAPI.use(express.json());
routerAPI.use(express.urlencoded({extended: true}));

//---------------ADMINISTRADOR--------------------
let isAdmin = true;

const CreateErrorAdmin = (ruta, metodo) =>{
    const error = {
        error: -1,
    }
    if(ruta && metodo){
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else{
        error.descripcion = 'no autorizado'
    }
    return error;
}

const soloAdmin = (req,res,next) =>{
    if(!isAdmin) {
        res.json(CreateErrorAdmin());
    } else{
        next()
    }
}

//-----------------PRODUCTOS--------------------
//DEVUELVE TODO LOS PRODUCTOS
routerAPI.get('/productos/:id?', async (req, res)=>{
    let prods = await productos.getAll();
    const id = req.params.id;
    if(id == null)
        res.json(prods);
    else
        res.json(prods[id]);
})
//AGREGA UN PRODUCTO A PRODUCTOS.TXT
routerAPI.post('/productos', soloAdmin, async (req, res)=>{
    const producto = req.body
    await productos.save(producto);
    res.redirect('/')
})
//MODIFICA UN PRODUCTO POR ID
routerAPI.put('/productos/:id', soloAdmin, async (req, res)=>{
    //Guardo en result una copia de productos.txt
    const result = await productos.getAll()
    const id = req.params.id //Guardo el ID del producto que entra como parametro
    const message = req.body; //Guardo el body (modificado)
    result[id].title = message.title;
    result[id].price = message.price; 
    await productos.replace(result);
    res.json(message);
})
//BORRA UN PRODUCTO POR ID
routerAPI.delete('/productos/:id', soloAdmin, async (req,res)=>{
    const id = req.params.id;
    await productos.deleteById(parseInt(id));
    res.json(`El Item ${id} se ha borrado`);
})
//------------------------------------------------------
//------------CARRITO-------------
routerAPI.get('/carrito', async (req, res)=>{
    let carrito = await carritos.GetAll()
    res.json(carrito);
})

routerAPI.post('/carrito', async (req, res)=>{
    const allCarro = await carritos.GetAll()
    const last = allCarro.length;
    const carrito = req.body;
    carritos.Create(carrito);

    if(allCarro.length == 0){
        res.json(1);
    }
    else
        res.json(allCarro[last-1].ID+1);
})

routerAPI.delete('/carrito/:id', async (req, res)=>{
    const id = req.params.id -1;
    await carritos.DeleteById(parseInt(id));
    res.json(`El Carrito ${id} se ha borrado`);
})

routerAPI.get('/carrito/:id/productos', async (req, res)=>{
    let carrito = await carritos.GetAll()
    const id = req.params.id -1;
    res.json(carrito[id].productos);
})

routerAPI.post('/carrito/:id/productos', async (req, res)=>{
    const allCarro = await carritos.GetAll()
    const id = req.params.id -1;
    const prods = req.body;
    let cart = allCarro[id];
    cart.productos.push(prods)
    await carritos.Replace(allCarro);
    res.json(cart);
})

routerAPI.delete('/carrito/:id/productos/:id_prod', async (req, res)=>{
    const allCarro = await carritos.GetAll()
    const id = req.params.id;
    const id_prod = req.params.id_prod;

    carritos.DeleteProdById(id,id_prod)

    // res.json(`El producto ${id_prod} se ha borrado del carrito ${id+1}`);
    res.json(allCarro);
})








app.use('/api',routerAPI);


const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

