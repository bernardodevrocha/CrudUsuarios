<template>
    <div>
        <h1>Tela de Login</h1>
        <hr>
        <div class="column is-mobile is-centered">
            <div class="column">
                <div v-if="error">
                    <p class="has-text-danger">{{ error }}</p>
                </div>
                <p>Email:</p>
                <input type="email" placeholder="email@email.com" class="input" v-model="email">
                <p>Senha:</p>
                <input type="password" placeholder="*******" class="input" v-model="password"> <hr>
                <button class="button is-success" @click="login">Login</button>
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
                password: "",
                email: "",
                error: undefined    
            }
        },
        methods:{
            login(){
                axios.post("http://localhost:8686/login", {
                    senha: this.password,
                    email: this.email,
                }).then(res => {
                    console.log(res);
                    localStorage.setItem('token', res.data.token);
                    this.$router.push({name: "Home"});
                }).catch(err => {
                    var msgError = err.response.data.err;
                    this.error=msgError;
                });
            }
        }
    }
</script>