// no service vão as minhas regras de negocio
// nao pode ter overbooking
// nao pode criar consulta em agenda sem ter um paciente

const pacienteRepository = require('../repository/paciente_repository');
const agendaRepository = require('../repository/agenda_repository');


function listarPaciente() {
    const listaAgenda = agendaRepository.listarAgenda();
    const listaPaciente = pacienteRepository.listarPaciente();

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


function inserirPaciente(paciente) {
    if(!paciente || !paciente.nome || typeof paciente.consultaMarcada !== 'boolean') {
        throw { id: 400, msg: "Paciente sem dados corretos"}
    }
    const listaPaciente = pacienteRepository.listarPaciente();

    const nomeJaExiste = listaPaciente.some(
        p => p.nome === paciente.nome 
    );

    if (nomeJaExiste) {
        throw { id: 400, msg: "Nome já existe" };
    }

    return pacienteRepository.inserirPaciente(paciente);
}


function buscarPorIdPaciente(id) {
    const agendas = agendaRepository.listarAgenda();
    const pacientes = pacienteRepository.listarPaciente();

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


function atualizarPaciente(id, paciente) {
    if(paciente && paciente.nome && typeof paciente.consultaMarcada === 'boolean') {
        const pacienteAtualizado = pacienteRepository.atualizarPaciente(id, paciente);
        if(pacienteAtualizado) {
            return pacienteAtualizado;
        } else {
            throw {id: 404, msg: "Paciente não encontrado"};
        }
    } else {
        throw {id: 400, msg: "Paciente sem dados corretos"};
    }
}


function deletarPaciente(id) {
    const paciente = pacienteRepository.deletarPaciente(id);
    if (!paciente) {
        throw { id: 404, msg: "Paciente não encontrado"}
    }

    if (paciente.consultaMarcada) {
        const listaAgenda = agendaRepository.listarAgenda();
        const consulta = listaAgenda.find(consulta => consulta.pacienteNome === paciente.nome);

        if(consulta) {
            agenda = agendaRepository.deletarAgenda(consulta.id);
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