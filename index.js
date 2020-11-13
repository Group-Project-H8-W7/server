const axios = require('axios');
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
let users = {}

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


  socket.on('jawab', (data) => {
    console.log(data, '==================================');
    console.log(users, "sebelum nambah nilai");
    users[data.username].score += data.nilai
    console.log(users, "setelah nambah nilai");
  })
  socket.on('disconnect', _=> {
    // console.log(users, "dari users", 00000000000000000000000000000000000)
    for (const key in users) {
      // console.log(key);
      if (users[key].id === socket.id.toString()) {
        delete users[key]
      }
    }
    // console.log(users, 'users setelah delete');
  })
  console.log('A user connected')
  socket.on('login', name => {
    users[name] = {}
    users[name].score = 0
    users[name].id = socket.id
    io.emit('LOGIN', name)
  })
  socket.on('refresh', _=> {
    io.emit('REFRESH', users)
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