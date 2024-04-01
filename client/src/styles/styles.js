import { LitElement, html, css } from 'lit-element';

export const GameStyles = css`
html, body {
    height: 100%;
    margin: 0;
}

.container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 900px; 
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}


.container-left {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: #f3f3f3;
    color: #333;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
}

.role-text {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}

.role-text:last-child {
    margin-bottom: 0;
}

/* Style for waiting box */

.waiting-box {
    background-color: #f8f9fa;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.waiting-text {
    font-weight: bold;
    text-align: center;
    font-size: 24px
}

.dot-typing {
    position: relative;
    left: -9999px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #9880ff;
    color: #9880ff;
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    animation: dot-typing 1.5s infinite linear;
    margin: 0 auto; 
  }
  
  @keyframes dot-typing {
    0% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    16.667% {
      box-shadow: 9984px -10px 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    33.333% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    50% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px -10px 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    66.667% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
    83.333% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px -10px 0 0 #9880ff;
    }
    100% {
      box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
    }
  }

  .box {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-bottom: 10px;
}

.form-group {
    margin-bottom: 15px;
}

.input-group {
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-control {
    padding: 7px; 
    font-size: 18px; 
    border: 1px solid #ced4da;
    border-radius: 5px 0 0 5px;
}



.btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 11px 15px; 
    cursor: pointer;
}

.btn-primary:hover {
    background-color: #0056b3;
}


.form-label {
    font-size: 18px;
}

.word-box {
    background-color: #e9ecef;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
}
.word-text {
    font-size: 22px;
    font-style: italic;
}

.text-center {
    text-align: center;
}

.question-form-box {
    text-align: center; 
    margin: 0 auto; 
    width: 50%; 
    background-color: rgb(255 255 255); 
    padding: 20px; 
    border-radius: 10px; 
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
}

.question-form-box form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.question-form-box .mb-3 {
    margin-bottom: 15px; 
}

.question-form-box label {
    width: 100%;
    text-align: left;
    text-align: left;
    display: block;
    margin-bottom: 5px; 
    font-weight: bold;
   
}
.question-form-box button {
    border-radius: 5px; 
    padding: 8px 16px; 
    background-color: #007bff; 
    color: #fff; 
    border: none; 
    cursor: pointer;
}


.question-box {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.question-text {
    margin-left: 3px;
    font-size: 20px;
    color: #333;
    font-weight: bold;
}

.contact-box {
    flex-direction: column;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-bottom: 10px;
}

.contact-box form {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #f8f9fa;
    padding: 20px;
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
}

.contact-box input[type="text"] {
    margin-right: 10px; 
}

.contact-box button {
    padding: 12px 23px 11px 21px;
    margin-left: 10px;
    margin-bottom: 15px; 
}


.lead-answer-form-box label {
    margin-right: 10px; 
}

.lead-answer-form-box {
    background-color: #e9ecef;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
}



.lead-answer-box {
    background-color: #f8f9fa;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
}

.lead-answer-text {
    margin-left: 3px;
    font-size: 18px;
    color: #333;
    font-weight: bold;
    font-style: italic;
}

.successful-contacts-box {
    background-color: #d4edda;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
}


.no-contacts-box {
    background-color: #f8d7da;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
}     
        
h1 {
    color: #333;
}

.form-label {
    font-weight: bold;
}

.mb-3 {
    margin-bottom: 1rem;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f8f9fa;
    padding: 20px;
    box-sizing: border-box;
}

.game-over-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #4a90e2, #b7c8e3)
    z-index: 999;
}
.game-over-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 70px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    overflow: hidden; 
    z-index: 1000; 
}



`


export const AccessStyles = css`
html, body {
    height: 100%;
    margin: 0;
}
.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #4a90e2, #b7c8e3)
    z-index: 999; /* Ensure the background appears behind the container */
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 70px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    overflow: hidden; 
    z-index: 1000; 
}
h1 {
    font-size: 32px;
    color: #007bff;
    margin-bottom: 20px;
}
p {
    font-size: 20px;
    color: #6c757d;
    margin-bottom: 30px;
}
.btn {
    padding: 10px 20px;
    font-size: 22px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.btn:hover {
    background-color: #0056b3;
}

.button-container {
    display: flex;
    gap: 10px; 
}
`

export const LoginStyles = css`
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    background-color: #fff;
    border: 2px solid #007bff; 
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    z-index: 1000;
}
h1 {
    font-size: 32px;
    color: #007bff;
    margin-bottom: 20px;
}
.form-group {
    margin-bottom: 20px;
}
label {
    font-size: 18px;
    color: #6c757d;
}
input {
    width: 100%;
    padding: 10px;
    font-size: 18px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    box-sizing: border-box;
}
button {
    width: 100%;
    padding: 15px;
    font-size: 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
button:hover {
    background-color: #0056b3;
}
.errors {
    color: red;
    margin-top: 10px;
}
`

export const HomeStyles = css`
.container-big {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    background-color: #fff;
    border: 2px solid #007bff; 
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    z-index: 1000;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
}

.button-container {
    display: flex;
    gap: 10px; 
}
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    justify-content: center;
}

h1 {
    font-size: 32px;
    color: #333; 
    margin-bottom: 20px;
}

.buttons-container {
    text-align: center; 
}

button {
    margin: 0 auto 10px; 
    padding: 10px 20px;
    font-size: 18px;
    background:  #f9f9f9; 
    color: #444444;
    border: 1px solid #cccccc; 
    border-radius: 5px;
    Border: 1px solid #cccccc;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease; 
}

button:hover {
    background-color:#6d6c6c;
    color: #fff; 
}

.create-game-button {
    background-color:  #4a90e2;
    color: #fff; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

.create-game-button:hover {
    background-color: #357dbb; 
}

.game-info {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    width: 300px; /* Set width */
    margin: 0 auto; 
    text-align: center; 
}

.game-info p {
    font-size: 22px; 
    color: #333;
    margin-bottom: 10px;
    text-align: center;
}

.player-count {
    cursor: pointer;
    font-size: 22px; 
}


.form-group {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }


label {
    display: block;
    margin-bottom: 10px;
  }
  
  input[type="url"],
  button {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
  }

.form-group button[type="submit"]:hover {
    background-color: #357dbb; /* Darker blue on hover */
}

.home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Adjust the height as needed */
  }


`