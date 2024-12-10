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

    const cliente = new Client(config);
    //conexão
    await cliente.connect();
    //query
    const sql = "INSERT INTO paciente (nome, consultaMarcada) VALUES ($1, $2) RETURNING *";
    const valores = [paciente.nome, paciente.consultaMarcada];
    const res = await cliente.query(sql, valores);
    await cliente.end();

    const saida = res.rows; 
    console.log(saida);
    return saida;
}

// get id
async function buscarPorIdPaciente(id) {
    console.log('buscar paciente id:' + id);
    console.log(id);
    
    

    const cliente = new Client(config);
    //conexão
    await cliente.connect();
    //query
    const sql = "SELECT * FROM paciente WHERE id = $1";
    const valores = [id];
    const res = await cliente.query(sql, valores);
    await cliente.end();

    return res.rows[0];
}

// put
async function atualizarPaciente(id, paciente) {
    if(!paciente || !paciente.nome || typeof paciente.consultaMarcada !== 'boolean') {
        return; 
    }
    
    const sql = "UPDATE paciente SET nome = $2, consultaMarcada = $3 WHERE id = $1 RETURNING *";
    const valores = [id, paciente.nome, paciente.consultaMarcada];
    
    const cliente = new Client(config);
    //conexão
    await cliente.connect();
    //query
    const res = await cliente.query(sql, valores);
    await cliente.end();

    const saida = res.rows; 
    console.log(saida);
    return saida;    
    
}

// delete
async function deletarPaciente(id) {
    const sql = "DELETE FROM paciente WHERE id = $1 RETURNING *";
    const valores = [id];
    
    const cliente = new Client(config);
    //conexão
    await cliente.connect();
    //query
    const res = await cliente.query(sql, valores);
    await cliente.end();

    const saida = res.rows; 
    console.log(saida);
    return saida;   

}

module.exports = {
    listarPaciente,
    inserirPaciente,
    buscarPorIdPaciente,
    atualizarPaciente,
    deletarPaciente
}