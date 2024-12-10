// no service vão as minhas regras de negocio
// nao pode ter overbooking
// nao pode criar consulta em agenda sem ter um paciente

const agendaRepository = require('../repository/agenda_repository');
const pacienteRepository = require('../repository/paciente_repository');


async function listarAgenda() {
    const listaAgenda = await agendaRepository.listarAgenda();
    console.log('------------');
    console.log(listaAgenda);

    if (listaAgenda.length !== 0) {
        return listaAgenda;
    } else {
        throw { id: 404, msg: "Nenhuma agenda registrada" };
    }
}


async function inserirAgenda(agenda) {
    if(!agenda || !agenda.data || !agenda.pacienteNome) {
        throw { id: 400, msg: "Agenda sem dados corretos"}
    }

    const listaAgenda = await agendaRepository.listarAgenda();
    const listaPaciente = await pacienteRepository.listarPaciente();

    const dataOcupada = listaAgenda.some(
        consulta => consulta.data === agenda.data 
    );

    if (dataOcupada) {
        throw { id: 400, msg: "Data ocupada" };
    }

    const paciente = listaPaciente.find(p => p.nome === agenda.pacienteNome);
    if (paciente) {
        paciente.consultaMarcada = true;
        await pacienteRepository.atualizarPaciente(paciente.id, paciente);
    } else {
        throw { id: 404, msg: "Paciente não encontrado" };
    }

    const novaAgenda = await agendaRepository.inserirAgenda(agenda, paciente.id);
    return {
        data: novaAgenda.data,
        id: novaAgenda.id,
        id_paciente: novaAgenda.id_paciente,
        pacienteNome: paciente.nome
    };
}



async function buscarPorIdAgenda(id) {

    let agenda = await agendaRepository.buscarPorIdAgenda(id);
    if (!agenda) {
        throw { id: 404, msg: "Agenda não encontrada"};
    }

    const listaPaciente = await pacienteRepository.listarPaciente();
    
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



async function atualizarAgenda(id, agenda) {
    if(agenda && agenda.data && agenda.pacienteNome) {
        const agendaAtualizada = await agendaRepository.atualizarAgenda(id, agenda);
        if(agendaAtualizada) {
            return agendaAtualizada;
        } else {
            throw {id: 404, msg: "Agenda não encontrada"};
        }
    } else {
        throw {id: 400, msg: "Agenda sem dados corretos"};
    }
}


async function deletarAgenda(id) {
    const agenda = await agendaRepository.deletarAgenda(id);
    
    if(!agenda) {
       throw {id: 404, msg: "Agenda não encontrada"};
    }

    const paciente = await pacienteRepository.buscarPorIdPaciente(agenda.id_paciente);
    
    if (paciente) {
        paciente.consultaMarcada = false;
        const pacienteAtualizado = await pacienteRepository.atualizarPaciente(paciente.id, paciente);

    } else {
        throw { id: 404, msg: "Paciente não encontrado" };
    }

    return agenda;
}

async function pesquisarPorDataAgenda(data) {
    const listaAgenda = await agendaRepository.listarAgenda();

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