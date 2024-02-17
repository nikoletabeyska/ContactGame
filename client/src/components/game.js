import { LitElement, html, css } from 'lit-element';
import { socket, GameService } from "../services/game.js";
import { sessionUserStorage } from "../services/session";
import { GameStyles } from '../styles/styles.js';


export class Game extends LitElement {
    static selector = "app-game";
    static properties = {
        playerRole: { type: String },
        gameWord: { type: String },
        currentQuestion: { type: String },
        gameId: { type: String },
        hasAskedQuestion: { type: Boolean },
        leadPlayerName: { type: String },
        leadAnswer: { type: Object },
        contacts: { type: Array },
        realAnswer: { type: String },
        gameOver: { type: Boolean },
        getContacts: { type: Boolean },
        hasNextQuestion: { type: Boolean },
        elapsedSeconds: { type: Number },
        remainingMinutes: { type: Number },
        remainingSeconds: { type: Number },
        gameOverBecauseTime: { type: Boolean },
    };

    constructor() {
        super();
        this.playerRole = null;
        this.gameWord = "";
        this.gameId = null;
        this.leadPlayerName = "";
        this.currentQuestion = "";
        this.hasAskedQuestion = false;
        this.leadAnswer = { answer: null, correct: null };
        this.contacts = [];
        this.realAnswer = "";
        this.gameOver = false;
        this.hasNextQuestion = null;
        this.elapsedSeconds = 0;
        this.remainingMinutes = 5;
        this.remainingSeconds = 0;
        this.gameOverBecauseTime = false;
        this.gameService = new GameService();
        this.gameService.connect();
        // TODO
        this.gameService.joinGame(`loca`, sessionUserStorage.name, (gameInfo) => {
            this.userState = 'joined';
            this.gameInfo = gameInfo;
            this.showJoin = false;
            this.render();
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this.startTimer();
        socket.on('gameLead', (socketId, playerName, gameId) => {

            if (socketId === socket.id) {
                this.playerRole = 'lead';
            } else {
                this.playerRole = 'player';
            }

            this.leadPlayerName = playerName;
            this.gameId = gameId;

        });

        socket.on('letterReveal', (letter) => {
            this.gameWord = this.gameWord + letter;

        });

        socket.on('question', (question) => {
            this.currentQuestion = question;
        });

        socket.on('correctAnswer', (answer, nextQuestion) => {
            this.leadAnswer.answer = answer;
            this.leadAnswer.correct = true;
            // the question should wait
            if (nextQuestion === null) {
                this.hasNextQuestion = false;
            } else {
                this.hasNextQuestion = true;
            }
            setTimeout(() => {
                this.hasAskedQuestion = this.hasNextQuestion;
                this.hasNextQuestion = null;
                this.currentQuestion = ((nextQuestion === null) ? "" : nextQuestion);
                this.leadAnswer = { answer: null, correct: null };
                this.realAnswer = "";
                this.contacts = [];
            }, 5000)
        });

        socket.on('incorrectAnswer', (answer, realAnswer) => {
            this.leadAnswer.answer = answer;
            this.leadAnswer.correct = false;
            this.realAnswer = realAnswer;
        });

        socket.on('contacts', (contacts) => {
            this.contacts = contacts;
            setTimeout(() => {
                this.contacts = [];
                this.hasAskedQuestion = false;
                this.currentQuestion = "";
                this.leadAnswer = { answer: null, correct: null };
                this.realAnswer = "";
            }, 8000)
        });

        socket.on('noContacts', (nextQuestion) => {
            if (nextQuestion === null) {
                this.hasNextQuestion = false;
            } else {
                this.hasNextQuestion = true;
            }

            setTimeout(() => {
                this.hasAskedQuestion = this.hasNextQuestion;
                this.hasNextQuestion = null;
                this.currentQuestion = (nextQuestion === null ? "" : nextQuestion);
                this.realAnswer = "";
                this.leadAnswer = { answer: null, correct: null };
                this.contacts = [];
            }, 5000)
        });

        socket.on('gameOver', (word) => {
            this.gameOver = true;
            this.gameWord = word;
        })
    }

    startTimer() {
        let durationInSeconds = 300; // 5 minutes
        this.timer = setInterval(() => {
            this.remainingMinutes = Math.floor(durationInSeconds / 60);
            this.remainingSeconds = durationInSeconds % 60;
            this.requestUpdate();
            if (durationInSeconds <= 0) {
                clearInterval(this.timer);
                this.gameOverBecauseTime = true;
            } else {
                durationInSeconds--;
            }
        }, 1000);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        socket.on('disconnect');
        clearInterval(this.timer);
        // console.log('4232ewwas')
        // socket.emit('joinGame', this.gameId, "asdsa");
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
        inputElement.value = '';
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
                <div>Remaining Time: ${this.remainingMinutes} minutes ${this.remainingSeconds} seconds</div>

                ${this.gameOverBecauseTime ? html`
                <div class="game-over-background"></div>
                    <div class="game-over-container">
                        <h1 class="text-center">Game over! Time exceeded!</h1>
                        <h2 class="text-center">${this.leadPlayerName} won!</h2>
                        </div>` : ''}

                ${this.gameOver ? html`
                <div class="game-over-background"></div>
                    <div class="game-over-container">
                        <h1 class="text-center">Game over! The word has been guessed correctly!</h1>
                        <h2 class="text-center">Players won! The word is "${this.gameWord}"</h2>
                        </div>` : ''}    

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
    
                <!-- everyone can see lead answer and if its correct-->
                ${this.leadAnswer.answer !== null ? html`
                <div class="lead-answer-box">
                    <p class="lead-answer-text">${this.leadPlayerName} answered: It is not "${this.leadAnswer.answer}"! This is ${this.leadAnswer.correct}! :)</p>
                </div>` : ''}
    
                <!-- result after answer-->
                ${this.leadAnswer.answer !== null && this.leadAnswer.correct ? html`
                    ${this.hasNextQuestion ? html`
                    <div class="next-question-box">
                        <p class="text-center">Moving to the next question...</p>
                    </div> `: html`
                    <div class="next-question-box">
                        <p class="text-center">No more questions! Players should ask again! ...</p>
                    </div> `}
                ` : ''}
                
                ${this.leadAnswer.answer !== null && !this.leadAnswer.correct ? html`
                    ${this.contacts.length !== 0 ? html`
                        <div class="successful-contacts-box">
                            <p class="text-center">There is/are ${this.contacts.length} successful contacts. </p>
                            ${this.contacts.map(name => html`<p class="name"> Contact with the word "${name}" has been made between players!</p>`)}
                            <p class="text-center">One letter of the word will be revealed!<p>
                            <p class="text-center">You should now ask questions again!</p>
                        </div>` : html`
                        ${this.hasNextQuestion ? html`
                        <div class="no-contacts-box">
                            <p class="text-center">No successful contacts. Moving to the next question... </p>
                        </div>` : html`
                        <div class="no-contacts-box">
                        <p class="text-center">No successful contacts! No more questions! Players should ask again! ...</p>
                        </div> `}
                    `}
            </div>    
         ` : ''};
         `
    }
}

customElements.define(Game.selector, Game);