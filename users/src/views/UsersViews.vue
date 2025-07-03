<template>
  <div>
    <h1>Painel ADM!</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Cargo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ processarRole(user.role) }}</td>
          <td>
            <router-link :to="{name: 'EditView', params:{id: user.id}}"><button class="button is-success">Editar</button></router-link> |
            <button class="button is-danger" @click="showModalUser(user.id)">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div :class="{ modal: true, 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Você quer realmente deletar este usuário!
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              nec iaculis mauris.
              <a href="#">@bulmaio</a>. <a href="#">#css</a>
              <a href="#">#responsive</a>
              <br />
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item" @click="hideModal()">Cancelar</a>
            <a href="#" class="card-footer-item" @click="deleteUser()">Apagar</a>
          </footer>
        </div>

        <button class="modal-close is-large" @click="hideModal()"></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {
    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    axios.get("http://localhost:8686/users", req)
      .then((res) => {
        console.log(res);
        this.users = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("Olá");
  },

  data() {
    return {
      users: [],
      showModal: false,
      userToDeleteId: null,
    };
  },
  methods: {
    processarRole: function (value) {
      if (value == 0) {
        return "Usuário";
      } else if (value == 1) {
        return "Administrador";
      } else {
        return "Não existe essa função";
      }
    },
    hideModal() {
      this.showModal = false;
    },
    showModalUser(id) {
      this.deleteUserId = id;
      this.showModal = true;
    },
    deleteUser() {
      var req = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      axios.delete("http://localhost:8686/users/" + this.deleteUserId, req)
        .then((res) => {
          console.log(res);
          this.showModal = false;

          axios.get("http://localhost:8686/users", req)
            .then((res) => {
                console.log(res);
                this.users = res.data;
            })
            .catch((err) => {
                console.log(err);
            });

        })
        .catch((err) => {
          console.log(err);
          this.showModal = false;
        });
    },
  },
};
</script>

<style scoped>
</style>