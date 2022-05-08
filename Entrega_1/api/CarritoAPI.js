const fs = require('fs');

class carritoAPI{
    constructor(archive){
        this.archive = archive;
    }
    async GetAll(){
        try {
            const objs = await fs.promises.readFile(this.archive, 'utf-8')
            return JSON.parse(objs)
        } catch (error) {
            return []
        }
    }
    async GetById(id){
        const objs = await this.GetAll();
        let Index_ID = objs.findIndex((data)=>{return data.ID === (id)}); //Busco el INDEX
        return objs[Index_ID]
    }
    async Create(cart){
        const array = await this.GetAll();
        let newID;
        if(array.length == 0){
            newID = 1;
        } else{
            newID = array[array.length-1].ID + 1;
        }
        let time = new Date().toLocaleString();
        let newCarrito = {ID: newID, timestamp: time, productos: cart};
        array.push(newCarrito);
        try {
            fs.promises.writeFile(this.archive, JSON.stringify(array))
            console.log('Carrito agregado!');
        }
        catch(err){
            console.log('Error guardando', err)
        }
    }
    async DeleteById(id){
        try{
            let array = await fs.promises.readFile(this.archive, 'utf-8') //LECTURA DEL ARCHIVO
            let json = JSON.parse(array);
            let Index_ID = json.findIndex((data)=>{return data.ID === (id)}); //Busco el INDEX 
            json.splice(Index_ID, 1); //Remuevo el objeto del array 
            let NewJson = JSON.stringify(json)
            fs.promises.writeFile(this.archive , NewJson) //Reescribo el archivo
            console.log('Borrado!');
        }
        catch(error){
            console.error('Error borrando el item', error)
        }
    }
    async Replace(prods){
        try {
            let NewJson = prods;
            fs.promises.writeFile(this.archive, JSON.stringify(NewJson));
            console.log('Agregado!');
        }
        catch(err){
            console.log('Error guardando', err)
        }
    }
    async DeleteProdById(cartID, productID){
        try {
            const cart = await this.GetById(parseInt(cartID));
            let Index_ID = cart.productos.findIndex((data)=>{return data.ID === (parseInt(productID))}); //Busco el INDEX
            cart.productos.splice(Index_ID, 1)
            
            const allCart = await this.GetAll()
            let Cart_Index = allCart.findIndex((data)=>{return data.ID === (cartID)})
            allCart.splice(Cart_Index, 1);
            await allCart.push(cart);

            fs.promises.writeFile(this.archive, JSON.stringify(allCart));
            console.log(Index_ID);
        }
        catch(err){
            console.log('Error guardando', err)
        }
    }
}

module.exports = carritoAPI;