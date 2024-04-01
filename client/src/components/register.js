import { render, html, nothing } from "lit-html";
import { authService } from '../services/auth'
import { Router } from "@vaadin/router";
import { z } from "zod";
import { navigateToLogin } from './utils'
import { LoginStyles } from '../styles/styles.js'
import { RegistrationInputSchema } from "./validationSchemas.js";

export class InvalidCredentialsError extends Error { }

export class Register extends HTMLElement {
  static selector = "app-register";
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

    try {
      RegistrationInputSchema.parse(data);
      await authService.register(data);
      const successEvent = new CustomEvent('registrationSuccess', { detail: { message: 'Registration successful!' } });
      document.dispatchEvent(successEvent);
      Router.go('/home');

    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          console.error(err.message);
        });
        this.errors = error.errors.map((err) => err.message).join('\n');

      } else {
        console.log('hello');
        this.errors = error.message;
      }

      this.render();
    }
  }

  static styles = LoginStyles;

  getTemplate() {
    return html`
     <style>
      ${Register.styles}
    </style>
    <div class="container">
      <form @submit=${this.submitHandler.bind(this)}>
        <h1>Registration form</h1>
        <div class="form-group">
          <label for="name">Name:</label>
          <input id="name" type="text" name="name" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="text" name="email" />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input id="password" type="password" name="password" />
        </div>
        <button>Register</button>
        <p>You already have an account?</p>
        <button @click=${navigateToLogin}>Login</button>
        ${this.errors === "" ? nothing : html`<div class="errors">${this.errors}</div>`}
      </form>
  </div>
    `;
  }

  render() {
    render(this.getTemplate(this), this.#shadowRoot);
  }
}

customElements.define(Register.selector, Register);