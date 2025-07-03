const knex = require("../database/connection");
const User = require('./User');

class PasswordToken {
  async create(email) {
    var user = await User.findEmail(email);
    if (user != undefined) {
      try {
        const token = Date.now(); 
        await knex
          .insert({
            user_id: user.id,
            used: 0,
            token: Date.now(),
          })
          .table("passwordtokens");
          return {status: true, token: token}
      } catch (err) {
        console.log(err);
        return {status: false, err: err}
      }
    } else {
      return {
        status: false,
        err: "O e-mail passado não existe no banco de dados",
      };
    }
  }

  async validate(token){
    try{
        const query = await knex.select().where({token: token}).table("passwordtokens");

        if(query.length > 0){
            var tk = query[0];

            if(tk.used){
                return {status: false}
            }else{
                return { status: true, token: tk };
            }
        }else{
            return {status: false, err: "Token inválido"};
        }
    }catch(err){
        return {status: false, err: err};
    }
  }

  async setUsed(token){
    await knex.update({used: 1}).where({token: token}).table("passwordtokens")
  }
}

module.exports = new PasswordToken();
