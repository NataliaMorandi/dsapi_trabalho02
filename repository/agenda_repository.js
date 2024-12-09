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
    SELECT a.id, a.data, p.nome AS pacienteNome, p.consultaMarcada
    FROM agenda a
    JOIN paciente p ON a.pacienteNome = p.nome
    ORDER BY a.id
`;
//"SELECT agenda.id, agenda.data, agenda.pacienteNome, paciente.nome FROM agenda JOIN paciente ON agenda.pacienteNome = paciente.nome ORDER BY id";
    const res = await cliente.query(sql);
    //finalizar conexão
    await cliente.end();

    const saida = res.rows; 
    console.log(saida);
    return saida;
}

// post
// ver se o horario está ocupado e retornar msg se estiver
async function inserirAgenda(agenda) {
    if (!agenda || !agenda.data || !agenda.pacienteNome) {
        return;
    }

    const sql = "INSERT INTO agenda (data, pacienteNome) VALUES ($1, $2) RETURNING *";
    const valores = [agenda.data, agenda.pacienteNome];

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
