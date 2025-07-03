<template>
  <div>
    <h1>Edição de usuários</h1>
    <hr />
    <div class="column is-mobile is-centered">
      <div class="column">
        <div v-if="error">
          <p class="has-text-danger">{{ error }}</p>
        </div>
        <p>Nome:</p>
        <input
          type="text"
          placeholder="Digite seu Nome"
          class="input"
          v-model="name"
        />
        <p>Email:</p>
        <input
          type="email"
          placeholder="email@email.com"
          class="input"
          v-model="email"
        />
        <hr />
        <button class="button is-success" @click="update">Editar</button>
      </div>
    </div>
  </div>
</template>

<!--Podemos criar uma página onde tem um timeout para confirmar que a conta foi criada-->

<script>
import axios from "axios";
export default {
  created() {
    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    axios
      .get("http://localhost:8686/users/" + this.$route.params.id, req)
      .then((res) => {
        if (res.data) {
          this.name = res.data.name;
          this.email = res.data.email;
          this.id = res.data.id;
        } else {
          this.$router.push({ name: "Home" });
        }
      })
      .catch((err) => {
        console.log(err.response);
        this.$router.push({ name: "Home" });
      });
  },
  data() {
    return {
      name: "",
      email: "",
      id: -1,
      error: undefined,
    };
  },
  methods: {
    update() {
      var req = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      axios
        .put(
          "http://localhost:8686/users",
          { name: this.name, email: this.email, id: this.id },
          req
        )
        .then((res) => {
          console.log(res);
          this.$router.push({ name: "users" });
        })
        .catch((err) => {
          var msgError = err.response.data.err;
          this.error = msgError;
        });
    },
  },
};
</script>