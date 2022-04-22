const socket = io.connect();

//-------------------------------------------PRODUCTOS--------------------------------------------

//Agarro el formulario a traves del ID x HTML
const formAgregarProducto = document.getElementById('formAgregarProducto')
//Agrego un evento para cuando apreto el boton submit
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    //Creamos un objeto
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    //Se los pasamos a la funcion socket con ID 'update'
    socket.emit('update', producto);
    //Limpiamos el formulario
    formAgregarProducto.reset()
})

//Le asigno a la funcion socket 'productos' la funcion para crear el tablero
socket.on('productos', productos => {
    TablaDeProductos(productos).then(html => {
    document.getElementById('productos').innerHTML = html
    })
});

//Funcion para crear tabla con el formato de 'vista.hbs'
const TablaDeProductos = (productos) =>{
    return fetch('plantillas/vista.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}


//-------------------------------------------MENSAJES--------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')
const formPublicarMensaje = document.getElementById('formPublicarMensaje')

formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = { 
        nombre: inputUsername.value, 
        texto: inputMensaje.value 
    }
    socket.emit('nuevoMensaje', mensaje);
    formPublicarMensaje.reset()
})

socket.on('mensajes', mensajes => {
    const html = ListaDeMensajes(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

const ListaDeMensajes = (mensajes) =>{
    return mensajes.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.nombre}</b>
                [<span style="color:brown;">${mensaje.hora}</span>] :
                <i style="color:green;">${mensaje.texto}</i>
            </div>
        `)
    }).join(" ");
}

inputUsername.addEventListener('input', () => {
    const Email = inputUsername.value.length
    const Texto = inputMensaje.value.length
    //Condiciones de enviar
    inputMensaje.disabled = !Email
    btnEnviar.disabled = !Email || !Texto
})

inputMensaje.addEventListener('input', () => {
    const Texto = inputMensaje.value.length
    btnEnviar.disabled = !Texto
})
