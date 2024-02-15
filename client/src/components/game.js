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
        contacts: { type: Array },
        realAnswer: { type: String },
        gameOver: { type: Boolean },
        getContacts: { type: Boolean },
        // revealLetter: { type: Boolean },
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
        this.contacts = [];
        this.realAnswer = "";
        this.gameOver = false;
        // this.revealLetter = false;
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
            "contacts": this.contacts,
            "contacts": this.contacts,
            "contacts": this.contacts
        })
    }

    connectedCallback() {
        super.connectedCallback();
        socket.on('gameLead', (socketId, playerName, gameId) => {
            printThis('gameLead begin')
            if (socketId === socket.id) {
                this.playerRole = 'lead';
            } else {
                this.playerRole = 'player';
            }
            this.leadPlayerName = playerName;
            this.gameId = gameId;
            if (this.playerRole === 'lead') {
                this.getContacts = false;
                // this.revealLetter = false;
            } else {
                this.getContacts = true;
                // this.revealLetter = true;
            }
            printThis('gameLead end')
            // this.revealLetter,
        });

        socket.on('letterReveal', (letter) => {
            printThis('letterReveal begin')
            this.gameWord = this.gameWord + letter;
            printThis('letterReveal end')
            // this.revealLetter = false;
        });

        // socket.on('firstLetterReveal', (letter) => {
        //     console.log('firstLetterReveal', this.playerRole,
        //         this.gameWord,
        //         this.gameId,
        //         this.leadPlayerName,
        //         this.currentQuestion,
        //         this.hasAskedQuestion,
        //         this.leadAnswer,
        //         this.contacts,
        //         this.realAnswer,
        //         this.gameOver)
        //     this.gameWord = this.gameWord + letter;
        // });

        socket.on('question', (question) => {
            printThis('question begin')
            this.currentQuestion = question
            printThis('question end')
        });

        socket.on('correctAnswer', (answerInfo, nextQuestion) => {
            printThis('correctAnswer begin')
            this.leadAnswer = answerInfo;
            // the question should wait
            printThis('correctAnswer end')

            setTimeout(() => {
                this.currentQuestion = nextQuestion;
                this.leadAnswer = {};
            }, 10000)
        });

        socket.on('incorrectAnswer', (answerInfo, realAnswer) => {
            printThis('incorrectAnswer begin')
            this.leadAnswer = answerInfo;
            this.realAnswer = realAnswer;
            printThis('incorrectAnswer end')
            socket.emit('getContacts', this.gameId);
            //console.log(this.gameId);
            //after the timer ends - ask for contacts
            // this.getContacts = true;
        });

        // socket.on('leaderOnlyAnswer', (answerInfo, realAnswer) => {
        //     console.log('leaderOnlyAnswer', this.playerRole,
        //         this.gameWord,
        //         this.gameId,
        //         this.leadPlayerName,
        //         this.currentQuestion,
        //         this.hasAskedQuestion,
        //         this.leadAnswer,
        //         this.contacts,
        //         this.realAnswer,
        //         this.gameOver)
        //     this.leadAnswer = answerInfo;
        //     this.realAnswer = realAnswer;
        // });

        // socket.on('leaderOnlyContacts', (contacts) => {
        //     printThis('leaderOnlyContacts begin')
        //     // this.revealLetter = true;
        //     // this.update();
        //     // this.revealLetter = true;
        //     this.contacts = contacts;
        //     printThis('leaderOnlyContacts end')
        //     socket.emit('revealLetter', this.gameId);

        //     setTimeout(() => {
        //         this.contacts = [];
        //         this.hasAskedQuestion = false;
        //         this.currentQuestion = "";
        //         this.leadAnswer = {};
        //         this.realAnswer = "";
        //     }, 10000)
        // });

        socket.on('contacts', (contacts) => {
            printThis('contacts begin')
            this.contacts = contacts;
            printThis('contacts end')


            setTimeout(() => {
                this.contacts = [];
                this.hasAskedQuestion = false;
                this.currentQuestion = "";
                this.leadAnswer = {};
                this.realAnswer = "";
            }, 10000)
        });

        socket.on('noContacts', (nextQuestion) => {
            printThis('noContacts begin')

            setTimeout(() => {
                this.currentQuestion = nextQuestion;
                this.leadAnswer = {};
                this.realAnswer = "";
                //this.getContacts = false;
                //this.revealLetter = false;
            }, 10000)
        });

        socket.on('gameOver', () => {
            printThis('gameOver begin')
            this.gameOver = true;
            printThis('gameOver end')
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
                <div class="lead-answer-box" ?hidden=${Object.keys(this.leadAnswer).length === 0}>
                    <p class="lead-answer-text" ?hidden=${Object.keys(this.leadAnswer).length === 0}>${this.leadPlayerName} answered: It is not "${this.leadAnswer.answer}"! This is ${this.leadAnswer.correct}! :)</p>
                </div>
    
                <!-- result after answer-->
                ${Object.keys(this.leadAnswer).length !== 0 && this.leadAnswer.correct ? html`
                    <div class="next-question-box">
                        <p class="text-center">Moving to the next question...</p>
                    </div>
                ` : ''}
                ${Object.keys(this.leadAnswer).length !== 0 && !this.leadAnswer.correct ? html`
                    ${this.contacts.length !== 0 ? html`
                        <div class="successful-contacts-box">
                            <p class="text-center">There is/are ${this.contacts.length} successful contacts. </p>
                            ${this.contacts.map(name => html`<p class="name">${name} guessed the word "${this.realAnswer}" right!</p>`)}
                            <p class="text-center">One letter of the word will be revealed!<p>
                            <p class="text-center">You should now ask questions again!</p>
                        </div>` : html`
                        <div class="no-contacts-box">
                            <p class="text-center">No successful contacts. Moving to the next question... </p>
                        </div>`}
                ` : ''}
                ${this.gameOver ? html`<p class="text-center">No more questions.Game over!</p>` : ''}
            </div>    
        `;
    }
}

customElements.define(Game.selector, Game);