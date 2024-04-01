import { Router } from '@vaadin/router';
import { Access } from './components/access'
import { Login } from './components/login'
import { Register } from './components/register'
import { Home } from './components/home'
import { Game } from './components/game'

const routes = [
    { path: '/', component: Access.selector },
    { path: '/auth/login', component: Login.selector },
    { path: '/auth/register', component: Register.selector },
    { path: '/home', component: Home.selector },
    { path: '/game', component: Game.selector },



]

const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);