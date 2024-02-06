import { html, render } from 'lit-html';
import { Router } from "@vaadin/router";

const navigateToLogin = () => {
    Router.go('/auth/login');
}

const navigateToRegister = () => {
    Router.go('/auth/register');
}


export class Access extends HTMLElement {
    static selector = 'app-access'
    #shadowRoot = null;

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'closed'});
        this.render();
    }


    getTemplate() {
        return html`
        <div>
            <h1>Contact game</h1>
            <button @click=${navigateToLogin}>Login</button>
            <button @click=${navigateToRegister}>Register</button>
        </div>`;
    }

   ;
    
    render() {
        render(this.getTemplate(this), this.#shadowRoot);
    }

}

customElements.define(Access.selector, Access)
