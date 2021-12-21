// ========== CONSTANT VALUES ============
// Number of cards in a standard deck
const deckSize = 52;
// Last index of number cards in an ordered
const numberCards = 36;
// Index of ace cards in an ordered deck
const aceCards = 48;
// Score to win blackjack
const blackjack = 21;
// Score at which computer will stand
const computerHandLimit = 17;

// ========== JS VARIABLES ===========
// JS variable for winner annoucement
const announcement = document.querySelector('.announcement');
const announcementText = document.querySelector('.announcement p');
const close = document.querySelector('.close');

// JS variables for player buttons
const hitMe = document.querySelector('.hit');
const playerStand = document.querySelector('.stand');

// JS variables for hand values and game scores
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

// Add card to player's side if player activates hit
hitMe.addEventListener('click', function () {
    createCard(playerCards);
    calcHandValue(player);
});

// Disable player's turns if they choose to stand
playerStand.addEventListener('click', function () {
    disableButtons();
    player.stand = true;
    // Continue game if no user has won
    while (player.win === 'N/A' && computer.win === 'N/A') {
        // Computer keeps playing until computer stands
        computerTurn();
        if (computer.stand) {
            calcWinner();
        }
    }
});

// ============= DECK OF CARDS ============
// Create array for deck of card objects
const deck = [];

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

// Function to reset all cards in deck to be available
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
    // Add card's suit and full name for all number cards
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
        // Add card's initial letter and suit to the div 'card' for cards J, Q, K, A
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
    // Set ARIA label to card for accessibility
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

// Enable player buttons
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
    // Loop to sum all card's values
    for (let i = 0; i < cardsArray.length; ++i) {
        total += +cardsArray[i].dataset.cardValue;
        // Check if user has an ace in their hand
        if (cardsArray[i].dataset.altCardValue) {
            altAce = true;
        }
    }
    // Set user's alternate hand value if ace has value of 11
    if (altAce) {
        altTotal = total + 10;
        user.altHand = altTotal;
        // Check if ace can have value of 11 without busting
        if (altTotal <= blackjack) {
            user.bestHand = altTotal;
        } else {
            user.bestHand = total;
        }
    } // if no ace in hand, the user's best hand is their standard hand
    else {
        user.bestHand = total;
    }
    // Set user's standard hand value to standard total
    user.hand = total;
    displayValue(user, altTotal);
    checkWinner(user);
}

// Function to update hand value of user
function displayValue(user, aceTotal) {
    // Hand value has 2 valid values due to ace card
    if (aceTotal && aceTotal <= blackjack) {
            user.handValue.textContent = user.hand + ' / ' + user.altHand;
            user.handValue.setAttribute('aria-label', `${user.name}'s hand value is ${user.hand} or ${user.altHand}.`);
    } // Else hand value has 1 valid value
    else {
            user.handValue.textContent = user.hand;
        user.handValue.setAttribute('aria-label', `${ user.name }'s hand value is ${ user.hand }.`);
    }
}

// Function to update game score
function displayScore() {
    computerScore.textContent = computer.score;
    computerScore.setAttribute('aria-label', `Computer has won ${ computer.score } games.`);
    playerScore.textContent = player.score;
    playerScore.setAttribute('aria-label', `Player has won ${ player.score } games.`);
}

// Computer keeps hitting if hand value is less than 17
function computerTurn() {
    if (computer.bestHand < computerHandLimit) {
        createCard(computerCards);
        calcHandValue(computer);
    } else {
        computer.stand = true;
    }
}

// Checks if user has won with additional card
function checkWinner(user) {
    if (user.bestHand === blackjack) {
        user.win = 'win';
        disableButtons();
        announceWinner(user);
    } else if (user.bestHand > blackjack) {
        user.win = 'lose';
        disableButtons();
        calcWinner();
    }
}

// Determine who is the winner as no more cards will be dealt 
function calcWinner() {
    // Check if either user lost
    if (computer.win === 'lose') {
        announceWinner(player);
    } else if (player.win === 'lose') {
        announceWinner(computer);
    } // Check which user has higher hand value
    else if (player.bestHand > computer.bestHand) {
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
    // Add a point to user's score
    ++user.score;
    announcementText.textContent = `${ user.name } wins!`;
    announcement.classList.add('show');
    close.focus();
    displayScore();
}

// Reset user's statistics for new game
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
// Clicking close triggers new game
close.addEventListener('click', function () {
    // Remove player and computer cards
    playerCards.innerHTML = '';
    computerCards.innerHTML = '';
    resetDeck();
    reset(player);
    reset(computer);
    // Remove announcement
    announcement.classList.remove('show');
    setup();
    enableButtons();
    computerCards.firstChild.focus();
});