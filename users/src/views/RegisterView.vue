<template>
    <div>
        <h1>Registro de Usuários</h1>
        <hr>
        <div class="column is-mobile is-centered">
            <div class="column">
                <div v-if="error">
                    <p class="has-text-danger">{{ error }}</p>
                </div>
                <p>Nome:</p>
                <input type="text" placeholder="Digite seu Nome" class="input" v-model="name">
                <p>Email:</p>
                <input type="email" placeholder="email@email.com" class="input" v-model="email">
                <p>Senha:</p>
                <input type="password" placeholder="*******" class="input" v-model="password"> <hr>
                <button class="button is-success" @click="register">Cadastrar</button>
            </div>
        </div>
    </div>
</template>

<!--Podemos criar uma página onde tem um timeout para confirmar que a conta foi criada-->

<script>
import axios from 'axios';
    export default{
        data(){
            return {
                name: "",
                password: "",
                email: "",
                error: undefined    
            }
        },
        methods:{
            register(){
                axios.post("http://localhost:8686/users", {
                    name: this.name,
                    senha: this.password,
                    email: this.email,
                }).then(res => {
                    console.log(res);
                    this.$router.push({name: "Home"})
                }).catch(err => {
                    var msgError = err.response.data.err;
                    this.error=msgError;
                });
            }
        }
    }
</script>