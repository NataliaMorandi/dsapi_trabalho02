const express = require('express') 
const pacienteRouter = require('./router/paciente_router')
const agendaRouter = require('./router/agenda_router')
const loginController = require('./controller/login_controller')
const authMiddleware = require('./middleware/auth_middleware')

const app = express()
const PORT = 3000

//importar o metodo e fazer a chamada de metodo do create table
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(function (req, res, next) {
  console.log(req.method+" - "+req.originalUrl);
  next();
});

//API para testar se a URL está no ar (http://localhost:3000)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/login', loginController.realizarLogin)

app.use(authMiddleware.verificarAcesso)
app.use('/api/pacientes', pacienteRouter)
app.use('/api/agendas', agendaRouter)

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`)
})

