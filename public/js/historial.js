const socketHistorial = socketProductos.connect();

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

    socketHistorial.emit('new-message', nuevoMensaje);
    return false;
}

function Get(url){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function render(data) {
    var stemplate = document.getElementById('template').innerHTML
    var tmpl = Handlebars.compile(stemplate);
    var ctx = {};
    // const productosUrl = 'http://localhost:8070/api/productos'
    // ctx.productos = JSON.parse(Get(productosUrl));
    ctx.productos = JSON.parse(data)
    html = tmpl(ctx)

document.getElementById('template').innerHTML = html;
}
socket.on('mensajes', function(data) {
    render(data);
    });