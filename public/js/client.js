const socket = io.connect();

function addMessage() {
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    const fecha = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()

    const nuevoMensaje = {
    email: email,
    mensaje: mensaje,
    fecha: fecha
};

    socket.emit('new-message', nuevoMensaje);
    return false;
}

function render(data) {
    console.log(data);
    console.log('test-client')
const html = data.map((elem, index) => {
    return (`
    <div>
        <strong>${elem.email}</strong>:
        <i>${elem.fecha}</i>
        <i>${elem.mensaje}</i>
    </div>
    `);
}).join(' ');

document.getElementById('messages').innerHTML = html;
}

document.getElementById('agregarVehiculo').addEventListener('click', () => {
    const nuevoVehiculo = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
socket.emit("guardarNuevoVehiculo",nuevoVehiculo)
})

function Get(url){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

async function listarProductos(listaProductos) {
    console.log("Lista de productos")
    console.log(listaProductos)
    let html = ''
    const stemplate = await fetch('views/historial.ejs').then(res => res.text())
    console.log(stemplate)
    if (listaProductos.length === 0){
        html = `<h4>No se encontraron productos.</h4>`
        document.getElementById('tablaProductos').innerHTML = html;
    }else{
        var ctx = {}
        ctx.vehiculos = listaProductos
        html = ejs.render(stemplate, ctx)
        // console.log(html)
        document.getElementById('tablaProductos').innerHTML = html;
    }
}

socket.on("productos", listaProductos => {
    listarProductos(listaProductos)
})

socket.on('mensajes', function(data) {
render(data);
});