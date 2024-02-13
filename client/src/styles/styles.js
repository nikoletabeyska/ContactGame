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


`