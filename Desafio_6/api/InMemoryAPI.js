class InMemoryAPI {
    constructor() {
        this.elementos = []
        this.id = 0
    }
    getById(id) {
        const elem = this.elementos.find(elem => elem.id == id)
        return elem || { error: `elemento no encontrado` }
    }

    getAll() {
        return [...this.elementos]
    }

    save(elem) {
        const newElem = { ...elem, id: ++this.id }
        this.elementos.push(newElem)
        return newElem
    }

    update(elem, id) {
        const newElem = { id: Number(id), ...elem }
        const index = this.elementos.findIndex(p => p.id == id)
        //findIndex devuelve -1 si no encuentra el id
        if (index !== -1) {
            this.elementos[index] = newElem
            return newElem
        } 
        else {
            return { error: `elemento no encontrado` }
        }
    }

    deleteById(id) {
        const index = this.elementos.findIndex(elem => elem.id == id)
        if (index !== -1) {
            return this.elementos.splice(index, 1);
        }
        else {
            return { error: `elemento no encontrado` };
        }
    }

    deleteAll() {
        this.elementos = [];
    }
}

module.exports = InMemoryAPI
