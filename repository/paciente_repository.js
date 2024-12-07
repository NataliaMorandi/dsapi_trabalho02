let listaPaciente = [
    {
        "nome": "natalia",
        "email": "natalia@gmail.com",
        "senha": "12345",
        "id": 1
    }
];
let idGeradorPaciente = 2;

// get lista
function listarPaciente() {
    return listaPaciente.map(paciente => removerCampoSenha(paciente));
}

// post
function inserirPaciente(paciente) {
    if(!paciente || !paciente.nome || typeof paciente.consultaMarcada !== 'boolean' || paciente.email || paciente.senha) {
        return;
    }
    paciente.id = idGeradorPaciente++;
    listaPaciente.push(paciente);
    return paciente;
}

function buscarPorEmail(email) {
    return listaPaciente.find((paciente) => {
        return paciente.email === email
    })
}

// get id
function buscarPorIdPaciente(paciente) {
    const pacienteEncontrado = listaPaciente.find(p => p.id === paciente.id);
    //return pacienteEncontrado;
    //Se encontrar usuário, retira a senha se não encontrar, retorna null ou undefined
    if(pacienteEncontrado) {
        return removerCampoSenha(pacienteEncontrado)
    }
    return null;
}

//retorna paciente sem expor a senha dele
function removerCampoSenha(paciente) {
    {
        return {
            id: paciente.id,
            nome: paciente.nome,
            consulta: paciente.consultaMarcada,
            email: paciente.email
        }
    }
}

// put
function atualizarPaciente(id, novoPaciente) {
    if(!novoPaciente || !novoPaciente.nome || typeof novoPaciente.consultaMarcada !== 'boolean' || novoPaciente.email) {
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
    buscarPorEmail,
    buscarPorIdPaciente,
    atualizarPaciente,
    deletarPaciente
}