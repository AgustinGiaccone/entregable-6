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

socket.on('mensajes', function(data) {
render(data);
});