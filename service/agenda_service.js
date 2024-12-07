// no service vão as minhas regras de negocio
// nao pode ter overbooking
// nao pode criar consulta em agenda sem ter um paciente

const agendaRepository = require('../repository/agenda_repository');
const pacienteRepository = require('../repository/paciente_repository');


function listarAgenda() {
    const listaAgenda = agendaRepository.listarAgenda();
    const listaPaciente = pacienteRepository.listarPaciente();

    const agendas = listaAgenda.map (consulta => {
        const paciente = listaPaciente.find(p => p.nome === consulta.pacienteNome);
            return {
                id: consulta.id,
                data: consulta.data,
                paciente: paciente
            };
    });

    if (agendas.length !== 0) {
        return agendas;
    } else {
        throw { id: 404, msg: "Nenhuma agenda registrada" };
    }
}


function inserirAgenda(agenda) {
    if(!agenda || !agenda.data || !agenda.pacienteNome) {
        throw { id: 400, msg: "Agenda sem dados corretos"}
    }

    const listaAgenda = agendaRepository.listarAgenda();
    const listaPaciente = pacienteRepository.listarPaciente();

    const dataOcupada = listaAgenda.some(
        consulta => consulta.data === agenda.data 
    );

    if (dataOcupada) {
        throw { id: 400, msg: "Data ocupada" };
    }

    const paciente = listaPaciente.find(p => p.nome === agenda.pacienteNome);
    if (paciente) {
        paciente.consultaMarcada = true;
        pacienteRepository.atualizarPaciente(paciente.id, paciente);
    } else {
        throw { id: 404, msg: "Paciente não encontrado" };
    }

    return agendaRepository.inserirAgenda(agenda);
}


function buscarPorIdAgenda(id) {

    let agenda = agendaRepository.buscarPorIdAgenda(id);
    if (!agenda) {
        throw { id: 404, msg: "Agenda não encontrada"};
    }

    const listaPaciente = pacienteRepository.listarPaciente();

    const paciente = listaPaciente.find(p => p.nome === agenda.pacienteNome);

    if(paciente) {
        agenda.paciente = {
            id: paciente.id,
            nome: paciente.nome,
            consultaMarcada: paciente.consultaMarcada     
        };
    }
    return agenda;
}



function atualizarAgenda(id, agenda) {
    if(agenda && agenda.data && agenda.pacienteNome) {
        const agendaAtualizada = agendaRepository.atualizarAgenda(id, agenda);
        if(agendaAtualizada) {
            return agendaAtualizada;
        } else {
            throw {id: 404, msg: "Agenda não encontrada"};
        }
    } else {
        throw {id: 400, msg: "Agenda sem dados corretos"};
    }
}


function deletarAgenda(id) {
    const agenda = agendaRepository.deletarAgenda(id);
    if(!agenda) {
       throw {id: 404, msg: "Agenda não encontrada"};
    }

    const listaPaciente = pacienteRepository.listarPaciente();
    const paciente = listaPaciente.find(p => p.nome === agenda.pacienteNome);

    if (paciente) {
        paciente.consultaMarcada = false;
        const pacienteAtualizado = pacienteRepository.atualizarPaciente(paciente.id, paciente);

    } else {
        throw { id: 404, msg: "Paciente não encontrado" };
    }

    return agenda;
}

function pesquisarPorDataAgenda(data) {
    const listaAgenda = agendaRepository.listarAgenda();

    const agenda = listaAgenda.find(consulta => consulta.data === data);

    if(agenda) {
        return agenda;
    } else {
        throw { id: 404, msg: "Paciente não encontrado para a agenda"}
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