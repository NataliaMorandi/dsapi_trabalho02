const agendaService = require('../service/agenda_service');

// listar - get
async function listarAgenda(req, res) {
    try {
        res.json(await agendaService.listarAgenda());
      } catch(err) {
        res.status(err.id).json(err)
      }
}

// inserir - post
async function inserirAgenda(req, res) {
    const agenda = req.body;
    try{
        // status de todos que sao padrao 200 nao precisa ser declarado
        // só declaramos o que é diferente, no caso o 201
      const agendaInserida = await agendaService.inserirAgenda(agenda);
      res.status(201).json(agendaInserida)
    }
    catch(err){
      res.status(err.id).json(err)
    }
}

// buscar - get
async function buscarPorIdAgenda(req, res) {
    const id = +req.params.id;
    try {
      res.json(await agendaService.buscarPorIdAgenda(id));
    } catch(err) {
      res.status(err.id).json(err)
    }
  }

// atualizar - put
async function atualizarAgenda (req, res) {
    const id = +req.params.id;
    const agenda = req.body;
    try{
      const agendaAtualizada = await agendaService.atualizarAgenda(id, agenda);
      res.json(agendaAtualizada)
    }
    catch(err){
      res.status(err.id).json(err)
    }
  }

  //deletar
function deletarAgenda(req, res) {
  const id = +req.params.id;
  try {
    res.json(agendaService.deletarAgenda(id));
  } catch(err) {
    res.status(err.id).json(err)
  }
}

// pesquisar - get
function pesquisarPorDataAgenda(req, res) {
    const body = req.body;
    console.log(body)
    try {
        res.json(agendaService.pesquisarPorDataAgenda(body.data));
      } catch(err) {
        res.status(err.id).json(err)
      }
}
  


module.exports = {
    listarAgenda,
    inserirAgenda,
    buscarPorIdAgenda,
    atualizarAgenda,
    deletarAgenda,
    pesquisarPorDataAgenda
}