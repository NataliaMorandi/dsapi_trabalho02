//let listaAgenda = [];
//let idGeradorAgenda = 1;

const {Client} = require('pg')

const config = {
    user:'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'apitrabalho02'
}

// get lista
async function listarAgenda() {
    const cliente = new Client(config);
    //conexão
    await cliente.connect();
    //query
    const sql =  `
    SELECT 
        Agenda.id AS agenda_id,
        Agenda.data AS agenda_date,
        Paciente.id AS paciente_id,
        Paciente.nome AS paciente_nome,
        Paciente.consultaMarcada AS consulta_marcada
    FROM 
        Agenda
    JOIN 
        Paciente
    ON 
        Agenda.id_paciente = Paciente.id;
`;

    const res = await cliente.query(sql);
    //finalizar conexão
    await cliente.end();

    const response = res.rows; 

    console.log(response);
    return response;
}

// post
// ver se o horario está ocupado e retornar msg se estiver
async function inserirAgenda(agenda, id_paciente) {
    if (!agenda || !agenda.data || !agenda.pacienteNome) {
        return;
    }

    const sql = "INSERT INTO agenda (data, id_paciente) VALUES ($1, $2) RETURNING *";
    const valores = [data, id_paciente];

    const cliente = new Client(config);
    // Conexão
    await cliente.connect();
    // Query
    const res = await cliente.query(sql, valores);
    await cliente.end();

    return res.rows[0];
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
async function deletarAgenda(id) {
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
