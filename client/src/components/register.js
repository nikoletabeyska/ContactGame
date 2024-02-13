import { render, html, nothing } from "lit-html";
import { authService } from '../services/auth'
import { Router } from "@vaadin/router";
import { z } from "zod";
export class InvalidCredentialsError extends Error { }

const RegistrationInputSchema = z.object({
  name: z
    .string()
    .min(2, "Name should have at least 2 alphabets")
    .refine(
      value => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
      "Name should contain only alphabets!"
    )
    .refine(
      value => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value),
      "Please enter both first name and last name!"
    ),

  email: z
    .string()
    .min(5)
    .email("Email must be valid!"),
  password: z.string().min(8, { message: "Password must be at least 8 symbols!" })
})

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
        this.errors = error.message;
      }

      this.render();
    }
  }

  getTemplate() {
    return html`
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
        ${this.errors === "" ? nothing : html`<div class="errors">${this.errors}</div>`}
      </form>
    `;
  }

  render() {
    render(this.getTemplate(this), this.#shadowRoot);
  }
}

customElements.define(Register.selector, Register);