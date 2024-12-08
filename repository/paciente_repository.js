let listaPaciente = [];
let idGeradorPaciente = 1;

const {Client} = require('pg')

const config = {
    user:'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'apitrabalho02'
}

// get lista
async function listarPaciente() {
    const cliente = new Client(config);
    //conexão
    await cliente.connect();
    //query
    const sql = "SELECT * FROM paciente ORDER BY(id)";
    const res = await cliente.query(sql);
    //finalizar conexão
    await cliente.end();

    const saida = res.rows; 
    console.log(saida);
    return saida;

}

// post
async function inserirPaciente(paciente) {
    if(!paciente || !paciente.nome || typeof paciente.consultaMarcada !== 'boolean') {
        return;
    }
    paciente.id = idGeradorPaciente++;
    listaPaciente.push(paciente);
    return paciente;
}

// get id
async function buscarPorIdPaciente(paciente) {
    const pacienteEncontrado = listaPaciente.find(p => p.id === paciente.id);
    return pacienteEncontrado;
}

// put
async function atualizarPaciente(id, novoPaciente) {
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
async function deletarPaciente(id) {
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