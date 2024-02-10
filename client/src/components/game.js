import { LitElement, html, css } from 'lit-element';
import { socket } from "../services/game.js";
export class Game extends LitElement {
    static selector = "app-game";
    static styles = css` `;

    static properties = {
        playerRole: { type: String },
        gameWord: { type: String },
        currentQuestion: { type: String },
        gameId: { type: String }
    };

    constructor() {
        super();
        this.playerRole = null; 
        this.gameWord = "";
        this.gameId = null;
        this.currentQuestion = "";
    }

    connectedCallback() {
        super.connectedCallback();
        socket.on('gameLead', (socketId, gameId) => {
            if (socketId === socket.id) {
                this.playerRole = 'lead';
            } else {
                this.playerRole = 'player';
            }
            this.gameId = gameId; 
        });

        socket.on('letterReveal', (letter) => {
            this.gameWord = this.gameWord + letter;
           
        })

        socket.on('question', (question) => {
            this.currentQuestion = question;
        })

    } 
    
    handleWordSubmission = (event) => {
        event.preventDefault();
        this.gameWord = this.shadowRoot.getElementById('word').value;
        socket.emit('gameWord', this.gameWord, this.gameId);
        this.gameWord = "";
    }

    handleQuestionSubmission = (event) => {
        event.preventDefault();
        const myQuestion = this.shadowRoot.getElementById('question').value;
        socket.emit('askQuestion', myQuestion, this.gameId, socket.id);
    }

    render() {
        return html`
            <div>
                <h1>Game</h1>
            </div>

            ${this.playerRole === 'lead' ? html`
                <p>Your role: Lead</p>
                <form ?hidden=${!(this.gameWord === "")} @submit=${this.handleWordSubmission}>
                    <label for="chooseWordField">Choose a word:</label>
                    <input type="text" name="word" id="word" />
                    <button type="submit">Submit</button>
                </form>
                ` : html`
                    <p>Your role: Player</p>
                    <p ?hidden=${!(this.gameWord === "")}>Waiting for lead player to choose a word</p> `}

            <p ?hidden=${(this.gameWord === "")}>Word letters: ${this.gameWord}</p>

            ${this.playerRole === 'player' ? html`
                <form ?hidden=${!(this.currentQuestion === "" && this.gameWord !== "")} @submit=${this.handleQuestionSubmission}>
                    <label for="askQuestionField">Write a question related to the word:</label>
                    <input type="text" name="question" id="question" />
                    <button type="submit">Submit</button>
                </form> ` : html`
                    <p ?hidden=${!(this.currentQuestion === "" && this.gameWord !== "")}>Waiting for players question</p> `}

            <p ?hidden=${(this.currentQuestion === "")}> Question: ${this.currentQuestion}</p>


        `;
    }
}

customElements.define(Game.selector, Game);