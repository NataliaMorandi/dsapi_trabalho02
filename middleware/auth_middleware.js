const loginService = require("../service/login_service")

//https://expressjs.com/pt-br/guide/writing-middleware.html
function verificarAcesso(req, res, next) {    
    try {
        const token = req.get("token");
        loginService.validarToken(token);
        next();
    } catch(err) {
        res.status(err.id).json(err);
    }

}
module.exports = { 
    verificarAcesso
}