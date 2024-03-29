import { render, html } from "lit-html";
import { Router } from "@vaadin/router";
import { sessionUserStorage } from "../services/session";
import { GameService, socket } from "../services/game";
import { authService } from "../services/auth.js";
import { HomeStyles } from '../styles/styles.js'

export class Home extends HTMLElement {
  static selector = "app-home";
  #shadowRoot = null;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "closed" });
    document.addEventListener('registrationSuccess', (event) => {
      this.message = event.detail.message;
    });

    this.isLinkCopied = false;
    this.showJoin = false;
    this.userState = 'none';
    this.socket = socket;
    this.gameService = new GameService();
    this.gameService.connect();
  }

  connectedCallback() {
    this.render();
    socket.on('playerJoined', (playerName) => {
      this.updateJoinedPlayers(playerName);
    });

    socket.on('gameStarted', (gameId) => {
      Router.go(`/game/${gameId}`);
    });
  }

  createGameHandler = () => {
    this.gameService.createGame(sessionUserStorage.userInfo, sessionUserStorage.name, (gameInfo) => {
      this.userState = 'owner';
      this.gameInfo = gameInfo;
      this.render();
    });
  }

  copyLinkHandler = () => {
    if (!navigator.clipboard) {
      alert('Copying to clipboard is not supported in this browser.');
      return;
    }

    navigator.clipboard.writeText(this.gameInfo.gameLink)
      .then(() => {
        this.isLinkCopied = true;
        this.render();
        setTimeout(() => {
          this.isLinkCopied = false;
          this.render();
        }, 2000);
      })
      .catch((error) => {
        console.error('Failed to copy link: ', error);
        alert('Failed to copy link. Please try again.');
      });
  }

  handleJoinRoom = (event) => {
    event.preventDefault();
    let linkInput = this.#shadowRoot.getElementById('linkInput');
    let link = linkInput.value;
    this.gameService.joinGame(link, sessionUserStorage.name, (gameInfo) => {
      this.userState = 'joined';
      this.gameInfo = gameInfo;
      this.showJoin = false;
      this.render();
    });
  }

  toggleJoin = () => {
    this.showJoin = !this.showJoin;
    this.render();
  }

  updateJoinedPlayers = (playerName) => {
    this.gameInfo.players.push(playerName);
    this.render();
  }

  togglePlayerList = () => {
    this.showPlayerList = !this.showPlayerList;
  }

  startGameHandler = () => {
    socket.emit('startGame', this.gameInfo.gameId);
  }

  logout = () => {
    authService.logout();
    Router.go('/');
  }

  static styles = HomeStyles;

  getTemplate() {
    return html`
      <style>
        ${Home.styles}
        </style>
        <h1>Welcome ${sessionUserStorage.name}!</h1>
          <button @click=${this.createGameHandler}>Create new game</button>
          <button @click=${this.toggleJoin}>Join game</button>
          <button @click=${this.logout}>Log out</button>
          ${this.userState === 'owner' || this.userState === 'joined' ? html`
          <div class="game-info">
                <p><strong>Game ID:</strong> ${this.gameInfo.gameId}</p>
                <button @click=${this.copyLinkHandler} ?hidden=${!(this.userState === 'owner')}>Copy link</button>
                ${this.userState === 'owner' ? html`
                    <div>
                      ${this.isLinkCopied ? html`<p>Link copied</p>` : ''}
                    </div>
                ` : ''}
                <p class="player-count" @click=${this.togglePlayerList}>${this.gameInfo.players.length}/${this.gameInfo.maxPlayers} players</p>
                <!-- <div class="player-list ${this.showPlayerList ? 'active' : ''}">
                    <ul>
                        ${this.gameInfo.players.map(player => html`<li>${player}</li>`)}
                    </ul>
                </div> -->
                ${this.userState === 'owner' ? html`<button @click=${this.startGameHandler}>Start</button>` : ''}
                ${this.userState === 'joined' ? html`<p>Waiting for owner to start game</p>` : ''}
            </div>
            ` : ''}
          ${this.showJoin === true ? html`
              <form @submit=${this.handleJoinRoom}>
                  <div class="form-group">
                      <label for="gameLink">Link to join:</label>
                      <input type="url" id="linkInput" name="link"/>
                      <button type="submit">Join</button>
                  </div>
              </form>
          ` : ''}
      `;
  }

  render() {
    if (sessionUserStorage.name === null) {
      Router.go('/');
      return;
    }
    render(this.getTemplate(this), this.#shadowRoot);
  }
}

customElements.define(Home.selector, Home);