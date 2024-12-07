const express = require('express' );
const router = express.Router();
const pacienteController = require('../controller/paciente_controller');


router.get('/', pacienteController.listarPaciente);
router.post('/', pacienteController.inserirPaciente);
router.get('/:id', pacienteController.buscarPorIdPaciente);
router.put('/:id', pacienteController.atualizarPaciente);
router.delete('/:id', pacienteController.deletarPaciente);

module.exports = router;
