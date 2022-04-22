const fs = require('fs');

class LogArchiveAPI{
    constructor(archive){
        this.archive = archive;
    }
    async getAll(){
        try {
            const objs = await fs.promises.readFile(this.archive, 'utf-8')
            return JSON.parse(objs)
        } catch (error) {
            return []
        }
    }
    async getById(id){
        const objs = getAll();
        let Index_ID = objs.findIndex((data)=>{return data.ID === (id)}); //Busco el INDEX
        return objs[Index_ID]
    }
    async save(item) {
        const array = await this.getAll();
        let newID;
        if(array.length == 0){
            newID = 1;
        } else{
            newID = array[array.length-1].ID + 1;
        }
        let newArray = {...item, ID: newID};
        array.push(newArray);
        const NewJson = JSON.stringify(array)
        try {
            fs.promises.writeFile(this.archive, NewJson)
            console.log('Agregado!');
        }
        catch(err){
            console.log('Error guardando', err)
        }
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

module.exports = LogArchiveAPI;
