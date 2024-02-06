import { render, html, nothing } from "lit-html";
import { authService } from '../services/auth'
import { Router } from "@vaadin/router";
import { LoginInputSchema } from "../services/validationSchemas";
import { z } from "zod";
export class InvalidCredentialsError extends Error { }

export class Login extends HTMLElement {
  static selector = "app-login";
  #shadowRoot = null;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    this.render();
  }

  async submitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = [...formData.entries()].reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    this.errors = "";
    try{
        LoginInputSchema.parse(data);
        await authService.login(data.email, data.password);
        Router.go('/home');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          console.error(err.message);
        });
        this.errors = error.errors.map((err) => err.message).join('\n');
       
      } else {
        this.errors = error.message;
      }

      this.render();

    }
  }

  getTemplate() {
    return html`
      <form @submit=${this.submitHandler.bind(this)}>
        <h1>Login</h1>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="text" name="email" />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input id="password" type="password" name="password" />
        </div>
        <button>Login</button>
         ${this.errors === "" ? nothing : html`<div class="errors">${this.errors}</div>`}


      </form>
    `;
  }

  render() {
    render(this.getTemplate(this), this.#shadowRoot);
  }
}

customElements.define(Login.selector, Login);