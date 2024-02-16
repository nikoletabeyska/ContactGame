import { LitElement, html, css } from 'lit-element';
import { socket } from "../services/game.js";
import { sessionUserStorage } from "../services/session";
import { GameStyles } from '../styles/styles.js';


export class Game extends LitElement {
    static selector = "app-game";
    static styles = css` `;

    static properties = {
        playerRole: { type: String },
        gameWord: { type: String },
        currentQuestion: { type: String },
        gameId: { type: String },
        hasAskedQuestion: { type: Boolean },
        leadPlayerName: { type: String },
        leadAnswer: { type: Object },
        thereAreContacts: { type: Boolean },
        gameOver: { type: Boolean },
    };

    constructor() {
        super();
        this.playerRole = null;
        this.gameWord = "";
        this.gameId = null;
        this.leadPlayerName = "";
        this.currentQuestion = "";
        this.hasAskedQuestion = false;
        this.leadAnswer = {};
        this.thereAreContacts = false;
        this.gameOver = false;
    }

    printThis(method) {
        console.log(method, {
            "playerRole": this.playerRole,
            "gameWord": this.gameWord,
            "gameId": this.gameId,
            "leadPlayerName": this.leadPlayerName,
            "currentQuestion": this.currentQuestion,
            "hasAskedQuestion": this.hasAskedQuestion,
            "leadAnswer": this.leadAnswer,
            "thereAreContacts": this.thereAreContacts,
            "gameOver": this.gameOver,
        })
    }

    connectedCallback() {
        super.connectedCallback();
        socket.on('gameLead', (socketId, playerName, gameId) => {
            this.printThis('gameLead begin')
            if (socketId === socket.id) {
                this.playerRole = 'lead';
            } else {
                this.playerRole = 'player';
            }
            this.leadPlayerName = playerName;
            this.gameId = gameId;
            this.printThis('gameLead end')
        });

        socket.on('letterReveal', (word) => {
            this.printThis('letterReveal begin')
            this.gameWord = word;
            this.printThis('letterReveal end')
        });

        socket.on('question', (question) => {
            this.printThis('question begin')
            this.currentQuestion = question
            this.printThis('question end')
        });

        socket.on('needQuestions', () => {
            this.printThis('needQuestions begin')
            this.hasAskedQuestion = false;
            this.printThis('needQuestions end')
        })

        socket.on('correctAnswer', (answerInfo, nextQuestion) => {
            this.printThis('correctAnswer begin')
            alert(`The leader answered with "${answerInfo.answer}" which is ${answerInfo.correct}!`)
            this.printThis('correctAnswer end')

            // setTimeout(() => {
            this.currentQuestion = nextQuestion;
            // this.leadAnswer = {};
            // }, 10000)
        });

        socket.on('incorrectAnswer', (answerInfo) => {
            this.printThis('incorrectAnswer begin')
            // this.leadAnswer = answerInfo;
            alert(`The leader answered with "${answerInfo.answer}" which is ${answerInfo.correct}!`)
            this.printThis('incorrectAnswer end')
            socket.emit('getContacts', this.gameId);
        });

        socket.on('showContacts', () => {
            this.printThis('showContacts begin')
            // this.thereAreContacts = true;
            alert("There are successful contacts")
            this.printThis('showContacts end')

            // setTimeout(() => {
            // this.thereAreContacts = false;
            this.hasAskedQuestion = false;
            this.currentQuestion = "";
            // this.leadAnswer = {};
            // }, 10000)
        });

        socket.on('noContacts', (nextQuestion) => {
            this.printThis('noContacts begin')
            alert("No successful contacts. Moving to the next question...")
            // setTimeout(() => {
            this.currentQuestion = nextQuestion;
            // this.leadAnswer = {};
            // }, 10000)
        });

        socket.on('gameOver', () => {
            this.printThis('gameOver begin')
            this.gameOver = true;
            this.printThis('gameOver end')
        })
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        socket.on('disconnect');
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
        const myAnswer = this.shadowRoot.getElementById('answer').value;
        socket.emit('askQuestion', myQuestion, myAnswer, this.gameId, socket.id, sessionUserStorage.name);
        this.hasAskedQuestion = true;
    }

    handleLeadAnswerSubmission = (event) => {
        event.preventDefault();
        const inputElement = this.shadowRoot.getElementById('leadAnswer');
        const answer = inputElement.value;
        socket.emit('leadAnswerToQuestion', answer, this.gameId);
        inputElement.value = '';
    }

    handleContactSubmission = (event) => {
        event.preventDefault();
        const inputElement = this.shadowRoot.getElementById('contact');
        const contactAnswer = inputElement.value;
        socket.emit('contact', contactAnswer, this.gameId);
    }

    static styles = GameStyles;

    render() {
        return html`
            <div class="container-left">
                <h2 class="role-text">Your role: ${this.playerRole}</h2>
                ${this.playerRole === 'player' ? html`
                <h2 class="role-text">Current lead: ${this.leadPlayerName}</h2>` : ''}
            </div>
            <div class="container">
                <h1 class="text-center mb-4">Contact Game</h1>
                ${this.playerRole === 'lead' && this.gameWord === "" ? html`
                    <div class="box"}>
                        <form @submit=${this.handleWordSubmission}>
                            <div class="mb-3">
                                <label for="chooseWordField" class="form-label">Choose a word:</label>
                                <input type="text" name="word" id="word" class="form-control" />
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                ` : html`
                    <div class="waiting-box" ?hidden=${!(this.gameWord === "")}>
                        <p class="waiting-text">Waiting for lead player to choose a word</p>
                        <div class="dot-typing"></div>
                    </div>
                `}
    
                <div class="word-box" ?hidden=${(this.gameWord === "")}>
                    <p class="word-text" ?hidden=${(this.gameWord === "")}>Word letters: ${this.gameWord.toUpperCase()}</p>
                </div>
    
                ${this.playerRole === 'player' && this.gameWord !== "" ? html`
                    ${!this.hasAskedQuestion ? html`
                        <div class="question-form-box">
                            <form @submit=${this.handleQuestionSubmission}>
                                <div class="mb-3">
                                    <label for="askQuestionField">Question related to the word:</label>
                                    <input type="text" name="question" id="question" class="form-control" />
                                </div>
                                <div class="mb-3">
                                    <label for="answerQuestionField">Answer:</label>
                                    <input type="text" name="answer" id="answer" class="form-control" />
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    ` : html`
                    <div class="waiting-box" ?hidden=${!(this.currentQuestion === "" && this.gameWord !== "")}>
                        <p class="waiting-text">Waiting for other players to ask their questions</p>
                        <div class="dot-typing"></div>
                    </div>
                    `}
                ` : html`
                    <div class="waiting-box" ?hidden=${!(this.currentQuestion === "" && this.gameWord !== "")}>
                        <p class="waiting-text">Waiting for players to ask questions</p>
                        <div class="dot-typing"></div>
                    </div>
                `}
    
                <!-- everyone can see this question-->
                ${this.currentQuestion !== "" ? html`
                    <div class="question-box">
                        <p class="question-text">${this.currentQuestion.playerName} asked: ${this.currentQuestion.question}</p>
                    </div>
                ` : ''}
    
                <!--  this is lead ui-->
                ${this.playerRole === 'lead' && this.currentQuestion !== "" ? html`
                    <div class="lead-answer-form-box">
                        <form @submit=${this.handleLeadAnswerSubmission}>
                            <div class="mb-3">
                                <label for="answerQuestionField" class="form-label">Write a word which can be related to this question:</label>
                                <input type="text" name="leadAnswer" id="leadAnswer" class="form-control" />
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                ` : ''}
    
                <!--  this is player ui-->
                ${this.playerRole === 'player' && this.currentQuestion !== "" ? html`
                    <div class="contact-box">
                        <form @submit=${this.handleContactSubmission}>
                            <div class="mb-3">
                                <input type="text" name="contact" id="contact" class="form-control" />
                            </div>
                            <button type="submit" class="btn btn-primary">Contact</button>
                        </form>
                    </div>
                ` : ''}
                ${this.gameOver ? html`<p class="text-center">No more questions.Game over!</p>` : ''}
            </div>    
        `;
    }
}

customElements.define(Game.selector, Game);