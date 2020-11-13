const axios = require('axios')
const app = require('./app')
const port = 3000
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
// ============================= IO ===============================
let users = []

// =========================== data ===============================

// async function question () {
//   try {
//     const result = await axios.get('https://opentdb.com/api.php?amount=10')
//     return result
//   } catch (error) {
//     return error
//   }
// }
// const quiz = _=> { return axios.get('https://opentdb.com/api.php?amount=10') }

// ========================= fetching =============================

io.on('connection', (socket) => {


  socket.on('disconnect', _=> {
    console.log(socket.id);
  })
  console.log('A user connected')
  socket.on('login', name => {
    const user = {
      name,
      id: socket.id,
      score: 0
    }
    users.push(user)
    console.log(name, users.name, users)
    io.emit('LOGIN', name)
  })
  socket.on('refresh', _=> {
    io.emit('REFRESH', users)
  })

  socket.on('setFinalScore', score => {
    const user = users.find(el => el.id === socket.id)
    user.score = score
    console.log(user)
  })

  socket.on('start', _=> {
    axios.get('https://opentdb.com/api.php?amount=10')
      .then(({ data }) => {
        data = data.results.map(el => {
          let { question, correct_answer, incorrect_answers } = el
          let incorrects = incorrect_answers
          incorrects.push(correct_answer)
          return { question, correct_answer, incorrect_answers }
        })
        io.emit('question', data )
      })
      .catch(err => {
        console.log(err, '======================= dari error');
        io.emit('question', err)
      })
  })
});


http.listen(port, () => {
  console.log('listening on port', port)
});