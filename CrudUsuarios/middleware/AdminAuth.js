var jwt = require("jsonwebtoken");
var secret = "secret123";

module.exports = function(req, res, next){
    let authToken = req.headers["authorization"];

    if(authToken != undefined){
        let bearer = authToken.split(" ");
        var token = bearer[1];
        try{
            let decoded = jwt.verify(token, secret);
    
            if(decoded.role !== 1){
                return res.status(403).json({err: "Acesso restrito a administradores"});
            }else{
                console.log(decoded);
                req.user = decoded;
                return next();
            }
        }catch(err){
            return res.status(401).json({err: "Você não foi autenticado com sucesso"});
        }

    }else{
        return res.status(403).json({err: "Você não está autenticado!"});
    }
}