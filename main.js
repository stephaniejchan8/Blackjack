// ========== JS VARIABLES ===========
// JS variable for winner annoucement
const announcement = document.querySelector('.announcement');
const announcementText = document.querySelector('.announcement p');
const close = document.querySelector('.close');

// JS variables for player buttons
const hitMe = document.querySelector('.hit');
const playerStand = document.querySelector('.stand');

// JS variables for hand values and game scores
// const computerHandValue = document.querySelector('.computerHandValue p');
// const playerHandValue = document.querySelector('.playerHandValue p');
const computerScore = document.querySelector('.computerScore p');
const playerScore = document.querySelector('.playerScore p');

// JS variables for DOM of computer and player cards
const computerCards = document.querySelector('.computerCards');
const playerCards = document.querySelector('.playerCards');

// ========== PLAYER/COMPUTER STATS =========
const player = {
    name: 'Player',
    win: 'N/A',
    stand: false,
    allCards: playerCards.getElementsByClassName('card'),
    hand: 0,
    altHand: 0,
    bestHand: 0,
    handValue: document.querySelector('.playerHandValue p'),
    score: 0
};
const computer = {
    name: 'Computer',
    win: 'N/A',
    stand: false,
    allCards: computerCards.getElementsByClassName('card'),
    hand: 0,
    altHand: 0,
    bestHand: 0,
    handValue: document.querySelector('.computerHandValue p'),
    score: 0
};



// ========== PLAYER BUTTONS ===========

hitMe.addEventListener('click', function () {
    createCard(playerCards);
    calcHandValue(player);
});
playerStand.addEventListener('click', function () {
    disableButtons();
    player.stand = true;
    // Continue game if no user has won
    while (player.win === 'N/A' && computer.win === 'N/A') {
        computerTurn();
        if (computer.stand) {
            calcWinner();
        }
    }
});

// ============= DECK OF CARDS ============
// Create array for deck of card objects
const deck = [];
const deckSize = 52;
const numberCards = 36;
const aceCards = 48;

// Function to create deck of cards with name, suit, value, available
function createDeck() {
    // Set size of deck to be 52 cards

    // Array to assign names to cards
    const cardName = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    let cardNameCounter = 0;

    // Array to assign suits to cards
    const cardSuit = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];

    // Loop to assign properties to 52 "cards"
    for (let i = 0; i < deckSize; ++i) {
        // Declare a temp card object
        const tempCard = new Object();

        // Assign all cards available 
        tempCard.available = true;

        // Change 'name' of card every 4 cards
        if (i !== 0 && i % 4 === 0) {
            cardNameCounter++;
        }
        tempCard.name = cardName[cardNameCounter];

        // Assign numerical cardValue to cards: 1-10 is same as number version of 'name'
        if (i < numberCards) {
            tempCard.cardValue = +cardName[cardNameCounter];
        } // Assign 2 values to ace cards
        else if (i >= aceCards) {
            tempCard.cardValue = 1;
            tempCard.altCardValue = 11;
        } // Assign numerical cardValue 10 to cards J, Q, K
        else {
            tempCard.cardValue = 10;
        }

        // Assign 1 of 4 suits to cards with the same name
        if (i % 4 === 0) {
            tempCard.suit = cardSuit[0];
        } else if (i % 4 === 1) {
            tempCard.suit = cardSuit[1];
        } else if (i % 4 === 2) {
            tempCard.suit = cardSuit[2];
        } else {
            tempCard.suit = cardSuit[3];
        }

        // Push temp card object to deck array
        deck.push(tempCard);
    }
}

createDeck();

function resetDeck() {
    for (let i = 0; i < deckSize; ++i) {
        deck[i].available = true;
    }
}

// ================= FUNCTIONS ==============
// Randomly generate an index number for the deck array
function randomCardNo() {
    let tempNo = Math.floor(Math.random() * 52);
    // Only return an index of a card that is available
    if (deck[tempNo].available) {
        return tempNo;
    } // re-run function randomCardNo until an available card is randomly chosen
    else {
        return randomCardNo();
    }
}

// Function to create cards
// Parameter determines which user to assign card to
function createCard(personCards) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.tabIndex = 2;
    const deckIndex = randomCardNo();
    if (deckIndex < numberCards) {
        if (deck[deckIndex].suit === 'Diamonds') {
            card.innerHTML = `<p>${ deck[deckIndex].name}</p><img class='suit' alt='Diamonds' src="images/diamond.png" />`;
            card.classList.add('red');
        } else if (deck[deckIndex].suit === 'Hearts') {
            card.innerHTML = `<p>${ deck[deckIndex].name}</p><img class='suit' alt='Hearts' src="images/heart.png" />`;
            card.classList.add('red');
        } else if (deck[deckIndex].suit === 'Clubs') {
            card.innerHTML = `<p>${ deck[deckIndex].name}</p><img class='suit' alt='Clubs' src="images/club.png" />`;
        } else {
            card.innerHTML = `<p>${ deck[deckIndex].name}</p><img class='suit' alt='Spades' src="images/spade.png" />`;
        }
    } else {
        // Add card's initial letter and suit to the div 'card'
        if (deck[deckIndex].suit === 'Diamonds') {
            card.innerHTML = `<p>${ deck[deckIndex].name.charAt(0) }</p><img class='suit' alt='Diamonds' src="images/diamond.png" />`;
            card.classList.add('red');
        } else if (deck[deckIndex].suit === 'Hearts') {
            card.innerHTML = `<p>${ deck[deckIndex].name.charAt(0) }</p><img class='suit' alt='Hearts' src="images/heart.png" />`;
            card.classList.add('red');
        } else if (deck[deckIndex].suit === 'Clubs') {
            card.innerHTML = `<p>${ deck[deckIndex].name.charAt(0) }</p><img class='suit' alt='Clubs' src="images/club.png" />`;
        } else {
            card.innerHTML = `<p>${ deck[deckIndex].name.charAt(0) }</p><img class='suit' alt='Spades' src="images/spade.png" />`;
        }
    }
    // Store card's value (and alt value) in a HTML data attribute
    card.dataset.cardValue = deck[deckIndex].cardValue;
    if (deck[deckIndex].altCardValue) {
        card.dataset.altCardValue = deck[deckIndex].altCardValue;
    }
//     const cardDescription = `${deck[deckIndex].name} of ${deck[deckIndex].suit}`;
// console.log(cardDescription);
    card.setAttribute('aria-label', `${deck[deckIndex].name} of ${deck[deckIndex].suit}`);
    // Add card to correct user's side
    personCards.appendChild(card);
    //   Remove card from available cards in deck
    deck[deckIndex].available = false;
}

// Deal first 2 cards to each user
function setup() {
    for (let i = 0; i < 2; ++i) {
        displayScore();
        createCard(playerCards);
        createCard(computerCards);
        calcHandValue(computer);
        calcHandValue(player);
    };
}

// Disable player buttons 
function disableButtons() {
    hitMe.setAttribute('disabled', 'true');
    playerStand.setAttribute('disabled', 'true');
}

function enableButtons() {
    hitMe.removeAttribute('disabled');
    playerStand.removeAttribute('disabled');
}

// 7. Function: calculate each user's total hand cardValue
// If total = 21 = user wins
// Allow for 2 totals(ace card)
function calcHandValue(user) {
    const cardsArray = user.allCards;
    let total = 0;
    let altTotal = 0;
    let altAce = false;
    for (let i = 0; i < cardsArray.length; ++i) {
        total += +cardsArray[i].dataset.cardValue;
        if (cardsArray[i].dataset.altCardValue) {
            altAce = true;
        }
    }
    if (altAce) {
        altTotal = total + 10;
        user.altHand = altTotal;
        if (altTotal <= 21) {
            user.bestHand = altTotal;
        } else {
            user.bestHand = total;
        }
    } else {
        user.bestHand = total;
    }
    user.hand = total;
    displayValue(user, altTotal);
    checkWinner(user);
}

function displayValue(user, aceTotal) {
    if (aceTotal && aceTotal <= 21) {
        // if (user.name === 'Player') {
            user.handValue.textContent = user.hand + ' / ' + user.altHand;
            user.handValue.setAttribute('aria-label', `${user.name}'s hand value is ${user.hand} or ${user.altHand}.`);
        // } else {
        //     computerHandValue.textContent = computer.hand + ' / ' + computer.altHand;
        // }
    } else {
        // if (userName === 'Player') {
            user.handValue.textContent = user.hand;
        user.handValue.setAttribute('aria-label', `${ user.name }'s hand value is ${ user.hand }.`);
        // } else {
        //     computerHandValue.textContent = computer.hand;
        // }
    }
}

function displayScore() {
    computerScore.textContent = computer.score;
    computerScore.setAttribute('aria-label', `Computer has won ${ computer.score } games.`);
    playerScore.textContent = player.score;
    playerScore.setAttribute('aria-label', `Player has won ${ player.score } games.`);
}

// Computer keeps hitting if hand value is less than 17
function computerTurn() {
    if (computer.bestHand <= 16) {
        createCard(computerCards);
        calcHandValue(computer);
    } else {
        computer.stand = true;
    }
}

// Checks if user has won with additional card
function checkWinner(user) {
    if (user.bestHand === 21) {
        user.win = 'win';
        disableButtons();
        announceWinner(user);
    } else if (user.bestHand > 21) {
        user.win = 'lose';
        disableButtons();
        calcWinner();
    }
}

// Determine who is the winner as no more cards will be dealt 
function calcWinner() {
    if (computer.win === 'lose') {
        announceWinner(player);
    } else if (player.win === 'lose') {
        announceWinner(computer);
    } else if (player.bestHand > computer.bestHand) {
        announceWinner(player);
    } else if (player.bestHand === computer.bestHand) {
        announceTie();
    } else {
        announceWinner(computer);
    }
}

// Announce a tie
function announceTie() {
    player.win = 'tie';
    announcementText.textContent = "It's a tie!";
    announcement.classList.add('show');
    close.focus();
}

// Announce a winner
function announceWinner(user) {
    user.win = 'win';
    ++user.score;
    announcementText.textContent = `${ user.name } wins!`;
    announcement.classList.add('show');
    close.focus();
    displayScore();
}

// Reset user's statistics
function reset(user) {
    user.win = 'N/A';
    user.stand = false;
    user.hand = 0;
    user.altHand = 0;
    user.bestHand = 0;
}

// ========== START GAME ===========
setup();

// ========== NEXT GAME ===========
close.addEventListener('click', function () {
    playerCards.innerHTML = '';
    computerCards.innerHTML = '';
    resetDeck();
    reset(player);
    reset(computer);
    announcement.classList.remove('show');
    setup();
    enableButtons();
    computerCards.firstChild.focus();
});