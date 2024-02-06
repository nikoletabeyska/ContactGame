import _ from 'lodash';
import { Router } from '@vaadin/router';
import { Access } from './components/access'
import { Login } from './components/login'
import { Register } from './components/register'
import { Home } from './components/home'

function component() {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());

const routes = [
    {path: '/', component: Access.selector},
    {path: '/auth/login', component: Login.selector},
    {path: '/auth/register', component: Register.selector},
    {path: '/home', component: Home.selector},

]

const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);