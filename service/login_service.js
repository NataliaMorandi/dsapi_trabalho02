const pacienteRepository = require('../repository/peciente_repository')
const jwt = require('jsonwebtoken')
const PALAVRA_CHAVE = "Idk2024";

function verificarLogin(pacienteLogin) {
    if(!pacienteLogin || !pacienteLogin.email || !pacienteLogin.senha) {
        throw { id: 401, msg: "Usuario ou senha inválidos" }
    }   
    let paciente = pacienteRepository.buscarPorEmail(pacienteLogin.email);
    if(paciente) {
        if(paciente.senha == pacienteLogin.senha) {
            let token = jwt.sign(
                { userId: paciente.id }, 
                PALAVRA_CHAVE,  
                { expiresIn: '1h' }
            );
            return token;
        }        
    }
    throw { id: 401, msg: "Usuario ou senha inválidos" }
}

function validarToken(token) {
    try {
        const payload = jwt.verify(token, PALAVRA_CHAVE);
        console.log("Payload", payload);
    } catch (err) {
        console.log("Erro no Token", err)
        throw  { id: 401, msg: "Token Inválido!" }
    }
}

module.exports = {
    verificarLogin, 
    validarToken
}