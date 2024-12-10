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
    
    const agendas = response.map(item => ({
        id: item.agenda_id,
        data: item.agenda_date, 
        paciente: {
          id: item.paciente_id,
          nome: item.paciente_nome,
          consultaMarcada: item.consulta_marcada
        }
      }));

    console.log(agendas);
    return agendas;
}

// post
// ver se o horario está ocupado e retornar msg se estiver
async function inserirAgenda(agenda, id_paciente) {
    if (!agenda || !agenda.data || !agenda.pacienteNome) {
        return;
    }
    console.log(id_paciente);

    const sql = "INSERT INTO agenda (data, id_paciente) VALUES ($1, $2) RETURNING *";
    const valores = [agenda.data, id_paciente];

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
    // const agendaEncontrada = listaAgenda.find(a => a.id === id);
    // return agendaEncontrada;

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
        Agenda.id_paciente = Paciente.id
    WHERE agenda.id = $1
`;
    const valores = [id];
    const res = await cliente.query(sql, valores);
    await cliente.end();

    const response = res.rows;
    
    const agendas = response.map(item => ({
        id: item.agenda_id,
        data: item.agenda_date, 
        paciente: {
          id: item.paciente_id,
          nome: item.paciente_nome,
          consultaMarcada: item.consulta_marcada
        }
      }));

    console.log(agendas);
    return agendas;

}

// put
async function atualizarAgenda(idAgenda, novaAgenda) {

    console.log('Atualizar agenda');
    console.log(idAgenda);
    console.log(novaAgenda);
    
    
    
    if(!novaAgenda || !novaAgenda.data || !novaAgenda.pacienteNome) {
        return;
    }

    const cliente = new Client(config);
    //conexão
    await cliente.connect();

    const sqlAgenda = "UPDATE agenda SET data = $2, id_paciente = $3 WHERE id = $1 RETURNING *";
    const valoresAgenda = [idAgenda, novaAgenda.data, novaAgenda.id_paciente];
    const resAgenda = await cliente.query(sqlAgenda, valoresAgenda);
    
    await cliente.end();
    return resAgenda.rows[0];

}


// delete
// deleta a consulta e limpa o campo de consulta do paciente tambem
async function deletarAgenda(id) {
    const sql = "DELETE FROM agenda WHERE id = $1 RETURNING *";
    const valores = [id];
    
    const cliente = new Client(config);
    //conexão
    await cliente.connect();
    //query
    const res = await cliente.query(sql, valores);
    await cliente.end();

    const saida = res.rows[0];     
    return saida;
}

module.exports = {
    listarAgenda,
    inserirAgenda,
    buscarPorIdAgenda,
    atualizarAgenda,
    deletarAgenda
}

