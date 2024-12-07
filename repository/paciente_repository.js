let listaPaciente = [];
let idGeradorPaciente = 1;

// get lista
function listarPaciente() {
    return listaPaciente;
}

// post
function inserirPaciente(paciente) {
    if(!paciente || !paciente.nome || typeof paciente.consultaMarcada !== 'boolean') {
        return;
    }
    paciente.id = idGeradorPaciente++;
    listaPaciente.push(paciente);
    return paciente;
}

// get id
function buscarPorIdPaciente(paciente) {
    const pacienteEncontrado = listaPaciente.find(p => p.id === paciente.id);
    return pacienteEncontrado;
}

// put
function atualizarPaciente(id, novoPaciente) {
    if(!novoPaciente || !novoPaciente.nome || typeof novoPaciente.consultaMarcada !== 'boolean') {
        return; 
    }
    let indicePaciente = listaPaciente.findIndex(p => p.id === id);

    if (indicePaciente === -1) {
        return;
    }

    novoPaciente.id = id;
    listaPaciente[indicePaciente] = novoPaciente;
    return listaPaciente[indicePaciente];
}

// delete
function deletarPaciente(id) {
    let indicePaciente = listaPaciente.findIndex(p => p.id === id);

    if (indicePaciente === -1) {
        return;
    }

    const pacienteRemovido = listaPaciente.splice(indicePaciente, 1)[0];
    return pacienteRemovido;
}

module.exports = {
    listarPaciente,
    inserirPaciente,
    buscarPorIdPaciente,
    atualizarPaciente,
    deletarPaciente
}