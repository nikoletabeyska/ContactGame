# ContactGame
## Description
Interactive real-time web based version of the physical multiplayer game "Contact". 
After creating a profile you can create or join game room via link.
Each game has time limit and limited number of players (at most 8).

Game rules:
- There are two roles in this game - Player role and Lead role.
- The Lead is choosen randomly. He have to choose and write a word.
- After that all of the players are being shown just the first letter of his word.
- PLayers should make gueses about the word and based on them they should submit a question.
- The Lead player is asked their questions one by one. In the meantime players can quess the answer to the question too.
- If the Lead cannot guess what the question is about or his answer is wrong - the game checks if some of the answers of the players are matching. This is called "contact" and if there is at least one pair of equal answers then another letter of the Lead's word is revealed. Then new questions are asked and everything repeats.
- If the Lead answers correctly then he proceeds with the other questions without checking for contacts.
- If the players succeed in the limited time to guess the word by their questions or by revealing all of the letters then they win. Otherwise the Lead player wins.

## Technologies 
- Express.js
- Web Components
- LitElement/lit-html
- Socket.IO
- Vaadin router
- Knex and Postgres as database for authentication
- Webpack
