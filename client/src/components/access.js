import { html, render } from 'lit-html';
import { navigateToLogin } from './utils'

export class Access extends HTMLElement {
    static selector = 'app-access'
    #shadowRoot = null;

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'closed' });
        this.render();
    }

    getTemplate() {
        return html`
        <div>
            <h1>Contact game</h1>
            <p>Please login to access the game.</p>
            <button @click=${navigateToLogin}>Login</button>
        </div>`;
    }

    render() {
        render(this.getTemplate(this), this.#shadowRoot);
    }
}

customElements.define(Access.selector, Access)
