import { Router } from "@vaadin/router";

export const navigateToLogin = () => {
    Router.go('/auth/login');
}

export const navigateToRegister = () => {
    Router.go('/auth/register');
}