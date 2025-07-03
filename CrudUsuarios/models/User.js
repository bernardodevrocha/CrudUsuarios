const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const passwordToken = require("./passwordToken");

class User {
  async findAll() {
    try {
      const select = await knex
        .select(["id", "name", "email", "role"])
        .table("users");
      if (select.length > 0) {
        return select;
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async findById(id) {
    try {
      const select = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users")
        .first();
      return select;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async new(email, senha, name) {
    try {
      var hash = await bcrypt.hash(senha, 10);
      await knex.insert({ email, senha: hash, name, role: 0 }).table("users");
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email) {
    try {
      var result = await knex
        .select("*")
        .from("users")
        .where({ email: email })
        .first();
      return result || undefined;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async update(id, name, email, role) {
    const user = await this.findById(id);

    if (user != undefined) {
      const editUser = {};

      if (email && email !== user.email) {
        const existingEmail = await this.findEmail(email);
        if (!existingEmail) {
          editUser.email = email;
        } else {
          return { status: false, err: "O e-mail já está cadastrado!" };
        }
      }

      if (name) editUser.name = name;
      if (role !== undefined) editUser.role = role;

      try {
        await knex("users").update(editUser).where({ id });
        return { status: true };
      } catch (err) {
        return { status: false, err: "Erro ao atualizar o usuário." };
      }
    } else {
      return { status: false, err: "O usuário não existe" };
    }
  }

  async delete(id) {
    var user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table("users");
        return { status: true };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return {
        status: false,
        err: "O usuário não existe, portanto não pode ser excluído!",
      };
    }
  }

  async newPassword(senha, user_id, token) {
    const hash = await bcrypt.hash(senha, 10);
    await knex("users").update({ senha: hash }).where({ id: user_id });
    await knex("passwordtokens").update({ used: 1 }).where({ token: token });
    await passwordToken.setUsed(token);
  }
}

module.exports = new User();
