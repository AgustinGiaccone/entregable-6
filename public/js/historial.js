const socket = io.connect();

function addMessage() {
    const id = document.getElementById('id ').value;
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;

    const nuevoMensaje = {
    id: id,
    title: title,
    price: price,
    thumbnail: thumbnail
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
        <strong>${elem.id}</strong>:
        <i>${elem.title}</i>
        <i>${elem.price}</i>
        <i>${elem.price}</i>
    </div>
    `);
}).join(' ');

document.getElementById('messages').innerHTML = html;
}

socket.on('mensajes', function(data) {
render(data);
});