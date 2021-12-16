// ========== JS VARIABLES ===========
// JS variable for winner annoucement
const announcement = document.querySelector('.announcement');
const announcementText = document.querySelector('.announcement p');
const close = document.querySelector('.close');

// JS variables for player buttons
const hitMe = document.querySelector('.hit');
const playerStand = document.querySelector('.stand');

// JS variables for hand values and game scores
const computerHandValue = document.querySelector('.computerHandValue p');
const playerHandValue = document.querySelector('.playerHandValue p');
const computerScore = document.querySelector('.computerScore p');
const playerScore = document.querySelector('.playerScore p');

// JS variables for DOM of computer and player cards
const computerCards = document.querySelector('.computerCards');
const playerCards = document.querySelector('.playerCards');

// ========== PLAYER/COMPUTER STATS =========
const player = {
  name: 'player',
  win: 'N/A',
  stand: false,
  allCards: playerCards.getElementsByClassName('card'),
  hand: 0,
  altHand: 0,
  bestHand: 0,
  score: 0
};
const computer = {
  name: 'computer',
  win: 'N/A',
  stand: false,
  allCards: computerCards.getElementsByClassName('card'),
  hand: 0,
  altHand: 0,
  bestHand: 0,
  score: 0
};

// ============= DECK OF CARDS ============
// Create array for deck of card objects
const deck = [];

// Array to assign names to cards
const cardName = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let cardNameCounter = 0;

// Array to assign suits to cards
const cardSuit = ['D', 'C', 'H', 'S'];

// Loop to assign properties to 52 "cards"
for (let i = 0; i < 52; ++i) {
  // Declare a temp card object
  const tempCard = new Object();

  // Assign all cards available 
  tempCard.available = 'available';

  // Change 'name' of card every 4 cards
  if (i !== 0 && i % 4 === 0) {
    cardNameCounter++;
  }
  tempCard.name = cardName[cardNameCounter];

  // Assign numerical cardValue to cards: 1-9 is same as number version of 'name'
  if (i < 32) {
    tempCard.cardValue = +cardName[cardNameCounter];
  } // Assign 2 values to ace cards
  else if (i >= 48) {
    tempCard.cardValue = 1;
    tempCard.altCardValue = 11;
  } // Assign numerical cardValue 10 to cards 10, J, Q, K
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

// ================= FUNCTIONS ==============
// Randomly generate an index number for the deck array
function randomCardNo() {
  let tempNo = Math.floor(Math.random() * 52);
  // Only return an index of a card that is available
  if (deck[tempNo].available === 'available') {
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
  const deckIndex = randomCardNo();
  // Add card's name and suit to the div 'card'
  card.innerHTML = `<p>${deck[deckIndex].name}${deck[deckIndex].suit}`;
  // Make diamonds and hearts cards red
  if (deck[deckIndex].suit === 'D' || deck[deckIndex].suit === 'H') {
    card.classList.add('red');
  }
  // Store card's value (and alt value) in a HTML data attribute
  card.dataset.cardValue = deck[deckIndex].cardValue;
  if (deck[deckIndex].altCardValue) {
    card.dataset.altCardValue = deck[deckIndex].altCardValue;
  }
  // Add card to correct user's side
  personCards.appendChild(card);
  //   Remove card from available cards in deck
  deck[deckIndex].available = "in play";
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
  console.log(user.name + `hand value: `, total);
  if (altAce) {
    altTotal = total + 10;
    user.altHand = altTotal;
    if (altTotal <= 21) {
      console.log(user.name + `alt hand value: `, altTotal);
      user.bestHand = altTotal;
    }
    else {
      user.bestHand = total;
    }
  } else {
    user.bestHand = total;
  }
  user.hand = total;
  displayValue(user.name, altTotal);
  checkWinner(user);
}

function displayValue(userName, aceTotal) {
  if (aceTotal && aceTotal <= 21) {
    if (userName === 'player') {
      playerHandValue.textContent = player.hand + ' / ' + player.altHand;
    } else {
      computerHandValue.textContent = computer.hand + ' / ' + computer.altHand;
    }
  } else {
    if (userName === 'player') {
      playerHandValue.textContent = player.hand;
    } else {
      computerHandValue.textContent = computer.hand;
    }
  }
}

function displayScore() {
  computerScore.textContent = computer.score;
  playerScore.textContent = player.score;
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
    console.log(`Blackjack!`);
  } else if (user.bestHand > 21) {
    user.win = 'lose';
    disableButtons();
    calcWinner();
    console.log(user.name + 'lost');
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
}

// Announce a winner
function announceWinner(user) {
  user.win = 'win';
  ++user.score;
  announcementText.textContent = `${user.name} wins!`;
  announcement.classList.add('show');
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
  reset(player);
  reset(computer);
  announcement.classList.remove('show');
  setup();
  enableButtons();
});