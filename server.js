const express = require('express')
const Contenedor = require('./Contenedor.js')
const ChatClass = require('./ChatClass')
const app = express()
const fs= require('fs');
const port = process.env.PORT || 8070
const routerProductos = express.Router()
const axios = require ('axios')

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const { resolve } = require('path');

const httpServer = new HttpServer(app);
const socket = new IOServer(httpServer);
const chats = new ChatClass('./chats.json')
const vehiculos = new Contenedor('productos.txt')
// var mensajes = chats.getAll()
chatsFile = './chats.json'
var mensajes = JSON.parse(fs.readFileSync(chatsFile, 'utf8'))

console.log(mensajes)

app.use(express.static('public'));
// app.use(express.static(__dirname + '/views'));
const messages = []
socket.on('connection', async (socket) => {
    console.log('Un cliente nuevo se ha conectado');
    const productos = vehiculos.getAll
    console.log(productos)
    // Lista de roductos
    socket.emit("productos", await productos)
    socket.on("guardarNuevoVehiculo", async (nuevoVehiculo) => {

        vehiculos.save(nuevoVehiculo)
        socket.emit("productos", await productos)
    })

    // Mensajes del chat
    socket.emit("messages", messages)

    socket.on("messegesNew", (nuevoMensaje) => {

        messages.push(nuevoMensaje)
        io.sockets.emit("messages", messages)
    })

    //historial mensajes del chat
    const message = await chats.loadMessage()
    socket.emit('messages', message )
    socket.on('messegesNew', async data => {

        await chats.saveMessage(data)
        const message2 = await chats.loadMessage()
        io.sockets.emit('messages', message2 );
    });
});

routerProductos.use(express.urlencoded({extended:true}))
routerProductos.use(express.json())

const itemRouter = express.Router({mergeParams: true})
const notFound = { error: "Producto no encontrado" };

app.set('views', __dirname+ '/public/views')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/api', routerProductos)
routerProductos.use('/:userId',itemRouter)

app.use(express.urlencoded({extended:true}))

const servidor = httpServer.listen(port, () => {
    console.log(`servidor en el http://localhost:${port}`)
})



app.get('/', async (req, res) => {
    const automovil = vehiculos.getAll
    res.render('inicio-formulario.ejs', {automovil})
})

// app.get('/productos', async (req, res) => {
//     const automovil = vehiculos.getAll
//     res.render('inicio-formulario.ejs', {automovil})
// })

app.post('/productos', async (req, res) => {
    const {body}= req
    const nuevoVehiculo = axios.post('http://localhost:8070/api/productos',body)
    res.redirect('/')
})

itemRouter.get('/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const automovil = await vehiculos.getById(id);
    console.log('el id buscado es', id)
    !automovil && res.status(404).json(notFound);
    res.status(200).json(automovil);
})

routerProductos.post('/productos',async(req,res)=>{
    const {body}= req
    console.log(body)
    const nuevoVehiculo = await vehiculos.save(body)
    const automovil = vehiculos.getAll
    res.send(automovil)
})

routerProductos.get('/productos',async(req,res)=>{
    const {body}= req
    console.log(body)
    // const nuevoVehiculo = await vehiculos.save(body)
    const automovil = vehiculos.getAll
    res.send(automovil)
})

itemRouter.delete('/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const producto = await vehiculos.deleteById(id);
    console.log('Se elimino el vehiculo con el id', id)
    const automovil = vehiculos.getAll
    res.send(automovil)
})

itemRouter.put('/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const title = req.body.title
    const precio = req.body.price
    const thumbnail = req.body.thumbnail
    const producto = await vehiculos.editById(id,title,price,thumbnail);
    const automovil = vehiculos.getAll
    res.send(automovil)
})

servidor.on('error', error => console.log(`error ${error}`))