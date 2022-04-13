const fs = require('fs');

class Item{
    constructor(title, price, ID){
        this.title = title;
        this.price = price;
        this.ID = ID
    }
}
class Container{
    constructor(archive){
        this.archive = archive;
    }
    async read(){
        try{
            const contenido = await fs.promises.readFile(this.archive, 'utf-8')
            let json = JSON.parse(contenido)
            return json;
        }
        catch(error){
            console.error('Error de lectura',error);
        }
    }
    async save(item) {
        try {
            let array = await fs.promises.readFile(this.archive, 'utf-8') //LECTURA DEL ARCHIVO
            if(array.length !== 0){
                let json = JSON.parse(array);

                //CHEQUEAMOS ID DEL ULTIMO ITEM
                if(json.length === undefined){
                    item.ID = 1;
                }
                else{
                    item.ID = json[json.length-1].ID + 1;
                }
                item.price = parseInt(item.price);
                json.push(item);
                let NewJson = JSON.stringify(json)
                fs.promises.writeFile('productos.txt', NewJson)
                console.log('Agregado!');
            }
            else{
                item.ID = 1;
                let NewJson = [item];
                fs.promises.writeFile('productos.txt', JSON.stringify(NewJson));
                console.log('Agregado!');
            }
        }
        catch(err){
            console.log('Error guardando', err)
        }
        // console.log(item.id);
    }
    async getById(id){
        let array = await fs.promises.readFile(this.archive, 'utf-8') //LECTURA DEL ARCHIVO
        let json = JSON.parse(array);
        let Index_ID = json.findIndex((data)=>{return data.ID === (id)}); //Busco el INDEX

        console.log(json[Index_ID]);
        return json[Index_ID]
    }
    async getAll(){
        let array = await fs.promises.readFile(this.archive, 'utf-8') //LECTURA DEL ARCHIVO
        if(array.length === 0){
            console.log("Archivo vacio");
            return array;
        }
        let json = JSON.parse(array);
        
        // console.log(json)
        return json;
    }
    async replace(item){
        try {
            let NewJson = item;
            fs.promises.writeFile('productos.txt', JSON.stringify(NewJson));
            console.log('Agregado!');
        }
        catch(err){
            console.log('Error guardando', err)
        }
    }
    async deleteById(id){
        try{
            let array = await fs.promises.readFile(this.archive, 'utf-8') //LECTURA DEL ARCHIVO
            let json = JSON.parse(array);
            let Index_ID = json.findIndex((data)=>{return data.ID === (id)}); //Busco el INDEX 
            json.splice(Index_ID, 1); //Remuevo el objeto del array 
            let NewJson = JSON.stringify(json)
            fs.promises.writeFile('productos.txt', NewJson) //Reescribo el archivo
            console.log('Borrado!');
        }
        catch(error){
            console.error('Error borrando el item', error)
        }
    }
    async deleteAll(){
        let NewJson = [];
        fs.promises.writeFile('productos.txt', JSON.stringify(NewJson)) //Reescribo el archivo
        console.log('Todos los objetos fueron borrados!');
    }
}

module.exports = Container;
