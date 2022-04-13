const express = require('express');
const {Router} = express;

const Container = require('../api/Container.js')

let Test = new Container('productos.txt')

const app = express();
app.use(express.static('public'))

const routerProductos = new Router();
routerProductos.use(express.json());
routerProductos.use(express.urlencoded({extended: true}));
//--------------------------------------------

app.set('views', './views');
app.set('view engine', 'pug');

//--------------------------------------------

//DEVUELVE TODO LOS PRODUCTOS
routerProductos.get('/productos', async (req, res)=>{
    const prods = await Test.getAll()

    res.render("vista", {
        productos: prods,
        hayProductos: prods.length
    });
})
//DEVUELVE PRODUCTO POR ID
routerProductos.get('/productos/:id', async (req, res)=>{
    const id = req.params.id
    const result = await Test.read()
    res.json(result[id-1]);
})
//AGREGA UN PRODUCTO A PRODUCTOS.TXT
routerProductos.post('/productos', async (req, res)=>{
    const producto = req.body
    await Test.save(producto);
    res.redirect('/')
})
//MODIFICA UN PRODUCTO POR ID
routerProductos.put('/productos/:id', async (req, res)=>{
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
    const id = req.params.id;
    await Test.deleteById(parseInt(id));
    res.json(`El Item ${id} se ha borrado`);
})

app.use('/api',routerProductos);


const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

