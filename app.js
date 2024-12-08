const express = require('express') 
const pacienteRouter = require('./router/paciente_router')
const agendaRouter = require('./router/agenda_router')

const app = express()
const PORT = 3000

// funcao db

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/api/pacientes', pacienteRouter)
app.use('/api/agendas', agendaRouter)

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`)
})


