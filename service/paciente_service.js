// no service vão as minhas regras de negocio
// nao pode ter overbooking
// nao pode criar consulta em agenda sem ter um paciente

const pacienteRepository = require('../repository/paciente_repository');
const agendaRepository = require('../repository/agenda_repository');


async function listarPaciente() {
    const listaAgenda = await agendaRepository.listarAgenda();
    const listaPaciente = await pacienteRepository.listarPaciente();

    const pacientes = listaPaciente.map  (paciente => {
        let tempPaciente = paciente;

        const consulta = listaAgenda.find(consulta => consulta.pacienteNome === paciente.nome);
        if (consulta) {
            tempPaciente.consulta = {
                id: consulta.id,
                data: consulta.data
            }
        }

        return tempPaciente;
    });

    if (pacientes.length !== 0) {
        return pacientes;
    } else {
        throw { id: 404, msg: "Nenhum paciente registrado" };
    }
}


async function inserirPaciente(paciente) {
    if(!paciente || !paciente.nome || typeof paciente.consultaMarcada !== 'boolean') {
        throw { id: 400, msg: "Paciente sem dados corretos"}
    }
    const listaPaciente = await pacienteRepository.listarPaciente();

    const nomeJaExiste = listaPaciente.some(
        p => p.nome === paciente.nome 
    );

    if (nomeJaExiste) {
        throw { id: 400, msg: "Nome já existe" };
    }

    return await pacienteRepository.inserirPaciente(paciente);
}


async function buscarPorIdPaciente(id) {
    const agendas = await agendaRepository.listarAgenda();
    const pacientes = await pacienteRepository.listarPaciente();

    const paciente = pacientes.find(p => p.id === id);
    if (!paciente) {
        throw { id: 404, msg: "Paciente não encontrado"}
    }

    if (paciente.consultaMarcada) {
        const consulta = agendas.find(a => a.pacienteNome === paciente.nome);
        paciente.consulta = {
            id: consulta.id,
            data: consulta.data
        }
    }

    return paciente;
}


async function atualizarPaciente(id, paciente) {
    if(paciente && paciente.nome && typeof paciente.consultaMarcada === 'boolean') {
        const pacienteAtualizado = await pacienteRepository.atualizarPaciente(id, paciente);
        if(pacienteAtualizado) {
            return pacienteAtualizado;
        } else {
            throw {id: 404, msg: "Paciente não encontrado"};
        }
    } else {
        throw {id: 400, msg: "Paciente sem dados corretos"};
    }
}


async function deletarPaciente(id) {
    const paciente = await pacienteRepository.deletarPaciente(id);
    if (!paciente) {
        throw { id: 404, msg: "Paciente não encontrado"}
    }

    if (paciente.consultaMarcada) {
        const listaAgenda = await agendaRepository.listarAgenda();
        const consulta = listaAgenda.find(consulta => consulta.pacienteNome === paciente.nome);

        if(consulta) {
            agenda = await agendaRepository.deletarAgenda(consulta.id);
        } else {
            throw { id: 404, msg: "Agenda não encontrada" };
        }
    }

    return paciente;
}


module.exports = {
    listarPaciente,
    inserirPaciente,
    buscarPorIdPaciente,
    atualizarPaciente,
    deletarPaciente

}