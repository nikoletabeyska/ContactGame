import { html, render, css } from 'lit-html';
import { navigateToLogin, navigateToRegister } from './utils'
import { AccessStyles } from '../styles/styles.js'

export class Access extends HTMLElement {
    static selector = 'app-access'
    #shadowRoot = null;

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.render();
    }

    static styles = AccessStyles;

    getTemplate() {
        return html`
        <style>
            ${Access.styles}
        </style>
         <div class="background"></div>
        <div class="container">
            <h1>Contact game</h1>
            <p>Please login or register to access the game.</p>
            <div class="button-container">
                <button class="btn btn-primary" @click=${navigateToLogin}>Login</button>
                <button class="btn btn-primary" @click=${navigateToRegister}>Register</button>
            </div>
        </div>`;
    }

    render() {
        render(this.getTemplate(this), this.#shadowRoot);
    }
}

customElements.define(Access.selector, Access)
