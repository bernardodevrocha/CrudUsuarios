import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import UsersView from "@/views/UsersViews.vue"
import axios from 'axios'
import EditView from '@/views/EditView.vue'

function AdminAuth(to, from, next){
if(localStorage.getItem("token") != undefined){

        var req = {
          headers:{
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }

        console.log(req);

        axios.post("http://localhost:8686/validate", {}, req).then(res => {
          console.log(res);
          next();
        }).catch(err => {
          console.log(err.response);
          next("/login")
        })
      }else{
        next("/login");
      }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue') /* webpackChunkName: "about" */
  },
  {
    path: '/registrar',
    name: 'registar',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/admin/users/edit/:id',
    name: 'EditView',
    component: EditView,
    beforeEnter: AdminAuth
  },
  {
    path: '/admin/users',
    name: 'users',
    component: UsersView,
    beforeEnter: AdminAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router