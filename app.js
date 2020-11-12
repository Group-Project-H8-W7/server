const cors = require('cors')
const express = require('express')
const app = express()
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())


io.on('connection', (socket) => { 
  console.log('A user connected')
});

http.listen(port, () => {
  console.log('listening on port', port)
});