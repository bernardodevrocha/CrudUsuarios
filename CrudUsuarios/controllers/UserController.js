const User = require("../models/User");
const PasswordToken = require("../models/passwordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordToken = require("../models/passwordToken");

var secret = "secret123";

class UserController {
  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (user == undefined) {
      res.status(404).json({ error: "Usuário não encontrado!" });
    } else {
      res.status(200).json(user);
    }
  }

  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  async create(req, res) {
    const { name, email, senha } = req.body;

    if (!email) return res.status(400).json({ err: "Email obrigatório!" });
    if (!senha) return res.status(400).json({ err: "senha obrigatório!" });
    if (!name) return res.status(400).json({ err: "name obrigatório!" });

    const emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406).json({ err: "O email ja esta cadastrado!" });
      return;
    }

    await User.new(email, senha, name);
    return res.status(200).send("Tudo certo");
  }

  async edit(req, res) {
    var { id, name, role, email } = req.body;
    var result = await User.update(id, email, name, role);
    if (result != undefined) {
      if (result.status) {
        res.status(200).send("Tudo certo!");
      } else {
        res.status(406).json(result.err);
      }
    } else {
      res.status(406).send("Ocorreu um erro no servidor!");
    }
  }

  async remove(req, res) {
    let id = req.params.id;

    let result = await User.delete(id);

    if (result.status) {
      res.status(200).send("Remoção concluída com sucesso");
    } else {
      res.status(406).json({ err: err });
    }
  }

  async recoverPassword(req, res) {
    let email = req.body.email;
    let result = await PasswordToken.create(email);

    if (result.status) {
      res.status(201).json("" + result.token);
    } else {
      res.status(406).json({ err: err });
    }
  }

  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;

    const isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      await User.newPassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );

      res.status(200).send("Senha alterada com sucesso!");
    } else {
      res.status(406).json({ err: "Erro ao alterar a senha!" });
    }
  }

  async login(req, res) {
    const { email, senha } = req.body;

    const user = await User.findEmail(email);

    if (user != undefined) {
      const result = await bcrypt.compare(senha, user.senha);

      if (result) {
        var token = jwt.sign({email: user.email, role: user.role}, secret);

        res.status(200).json({ token: token });
      } else {
        res.status(401).json({ err: "Credenciais incorretas" });
      }
    } else {
      res.status(401).json({ err: "O usuário não existe!" });
    }
  }
}

module.exports = new UserController();
