const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const types = ["C", "D", "H", "S"];

let dealerScore = 0;
let yourScore = 0;
let dealerAceCount = 0;
let yourAceCount = 0; 
let hidden;
let deck;
let canHit = true;

document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stay").addEventListener("click", stay);

init();

function init() {
    buildDeck();
    shuffleDeck();
    startGame();
    render();
}

function buildDeck() {
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerScore += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    while (dealerScore < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerScore += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourScore += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourScore += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourScore, yourAceCount) > 21) {
        canHit = false;
    }

}

function stay() {
    dealerScore = reduceAce(dealerScore, dealerAceCount);
    yourScore = reduceAce(yourScore, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourScore > 21) {
        message = "You Lose!";
    }
    else if (dealerScore > 21) {
        message = "You win!";
    }
    else if (yourScore == dealerScore) {
        message = "Draw!";
    }
    else if (yourScore > dealerScore) {
        message = "You Win!";
    }
    else if (yourScore < dealerScore) {
        message = "You Lose!";
    }

    document.getElementById("dealer-score").innerText = dealerScore;
    document.getElementById("your-score").innerText = yourScore;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerScore, playerAceCount) {
    while (playerScore > 21 && playerAceCount > 0) {
        playerScore -= 10;
        playerAceCount -= 1;
    }
    return playerScore;
}