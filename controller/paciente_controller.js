const pacienteService = require('../service/paciente_service');

// listar - get
function listarPaciente(req, res) {
    try {
        res.json(pacienteService.listarPaciente());
      } catch(err) {
        res.status(err.id).json(err)
      }
}

// inserir - post
function inserirPaciente(req, res) {
    const paciente = req.body;
    try{
        // status de todos que sao padrao 200 nao precisa ser declarado
        // só declaramos o que é diferente, no caso o 201
      const pacienteInserido = pacienteService.inserirPaciente(paciente);
      res.status(201).json(pacienteInserido)
    }
    catch(err){
      res.status(err.id).json(err)
    }
}

// buscar - get
function buscarPorIdPaciente(req, res) {
    // O + antes converte o valor para number (na URL vem como string)
    const id = +req.params.id;
    try {
      res.json(pacienteService.buscarPorIdPaciente(id));
    } catch(err) {
      res.status(err.id).json(err)
    }
  }

// atualizar - put
function atualizarPaciente (req, res) {
    const id = +req.params.id;
    const paciente = req.body;
    try{
      const pacienteAtualizado = pacienteService.atualizarPaciente(id, paciente);
      res.json(pacienteAtualizado)
    }
    catch(err){
      res.status(err.id).json(err)
    }
  }

  //deletar
function deletarPaciente(req, res) {
  const id = +req.params.id;
  try {
    res.json(pacienteService.deletarPaciente(id));
  } catch(err) {
    res.status(err.id).json(err)
  }
}


module.exports = {
    listarPaciente,
    inserirPaciente,
    buscarPorIdPaciente,
    atualizarPaciente,
    deletarPaciente
}