const express = require('express');
const http = require('http');
const path = require('path');
const soketio = require('socket.io');

// create app using express 
// create server using app
//create io using server
const app = express();
const server = http.createServer(app);
const io = soketio(server);

io.on('connection', (socket)=> {
    socket.on("send-location", (data) => {
        io.emit('receive-location', {id: socket.id, ...data})
    })

    socket.on("disconnect", (id)=> {
        io.emit('user-disconnected', socket.id)
    })
    console.log('connected')
})

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.render('index')
})

server.listen(3000, () => {
    console.log('app started on port 3000')
})