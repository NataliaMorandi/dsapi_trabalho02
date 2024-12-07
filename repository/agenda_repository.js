let listaAgenda = [];
let idGeradorAgenda = 1;

// get lista
async function listarAgenda() {
    return listaAgenda; 
}

// post
// ver se o horario está ocupado e retornar msg se estiver
async function inserirAgenda(agenda) {
    if(!agenda || !agenda.data || !agenda.pacienteNome) {
        return;
    }

    agenda.id = idGeradorAgenda++;
    listaAgenda.push(agenda);
    return agenda;
}

// get id
async function buscarPorIdAgenda(id) {
    const agendaEncontrada = listaAgenda.find(a => a.id === id);
    return agendaEncontrada;
}

// put
async function atualizarAgenda(id, novaAgenda) {
    if(!novaAgenda || !novaAgenda.data || !novaAgenda.pacienteNome) {
        return;
    }

    let indiceAgenda = listaAgenda.findIndex(agenda => agenda.id == id);

    if (indiceAgenda == -1) {
        return;
    }

    novaAgenda.id = id;
    listaAgenda[indiceAgenda] = novaAgenda;
    return listaAgenda[indiceAgenda];
}


// delete
// deleta a consulta e limpa o campo de consulta do paciente tambem
function deletarAgenda(id) {
    let indiceAgenda = listaAgenda.findIndex(agenda => agenda.id == id);

    if (indiceAgenda == -1) {
        return;
    }

    const agendaRemovida = listaAgenda.splice(indiceAgenda, 1)[0];
    return agendaRemovida;
}

module.exports = {
    listarAgenda,
    inserirAgenda,
    buscarPorIdAgenda,
    atualizarAgenda,
    deletarAgenda
}
