
class Libro {
    constructor(nombre,autor){
        this.nombre = nombre;
        this.autor = autor;
    }
}
class Persona {
    constructor(nombre, apellido, libros, mascotas){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName(){
        return this.nombre +" "+ this.apellido;
    }
    addMascota(mascota){
        return this.mascotas.push(mascota);
    }
    countMascotas(){
        return this.mascotas.length;
    }
    addBook(book){
        return this.libros.push(book);
    }
    getBookNames(){
        let aux = [];

        for(let i = 0; i < this.libros.length; i++) {
            aux[i]=this.libros[i].nombre
        }

        return aux;
    }
}   
let HarryPotter = new Libro('Harry Potter', 'J.K. Rowling');
let LordOfTheRings = new Libro('Lord of the Rings', 'J.R.R. Tolkien');
let Hamlet = new Libro('Hamlet', 'William Shakespeare');
let Test = new Persona('Maxi', 'Chan', [HarryPotter, LordOfTheRings], ['Tofu', 'Laika'] );

Test.addMascota('Rupert') //Agrega "Rupert" a mascotas
Test.addBook(Hamlet) //Agrega "Hamlet" a libros

console.log(Test.getFullName());
console.log(Test.getBookNames());
console.log(Test.countMascotas());
console.log(Test);