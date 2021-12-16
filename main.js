// Create array with deck of 52 cards
//   Loop to automate card name, suit, cardValue, available
// Object - name, suit, cardValue
//   ? available(or you could make 2 arrays - dealing deck array and a base deck array)
const announcement = document.querySelector('.announcement');
const hitMe = document.querySelector('.hit');
const playerStand = document.querySelector('.stand');
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

// Declare JS variables for DOM of computer and player cards
const computerCards = document.querySelector('.computerCards');
const playerCards = document.querySelector('.playerCards');

// Create JS objects to store if user has won or is standing
const player = {
  name: 'player',
  win: 'N/A',
  stand: false,
  allCards: playerCards.getElementsByClassName('card'),
  hand: '0',
  score: 0
};
const computer = {
  name: 'computer',
  win: 'N/A',
  stand: false,
  allCards: computerCards.getElementsByClassName('card'),
  hand: '0',
  score: 0
};
const computerHandValue = document.querySelector('.computerHandValue p');
const playerHandValue = document.querySelector('.playerHandValue p');

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
const createCard = (personCards) => {
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
for (let i = 0; i < 2; ++i) {
  createCard(playerCards);
  createCard(computerCards);
  calcHandValue(computer);
  calcHandValue(player);
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
    console.log(user.name + `alt hand value: `, altTotal);
    if (altTotal <= 21) {
      user.hand = `${total} / ${altTotal}`;
    }
  } else {
    user.hand = `${total}`;
  }
  displayValue(user.name);
  checkWinner(user, total, altTotal);
}

function displayValue(userName) {
  if (userName === 'player') {
    playerHandValue.textContent = player.hand;
  } else {
    computerHandValue.textContent = computer.hand;
  }
}

function computerTurn() {
  if (+computer.hand <= 16) {
    createCard(computerCards);
    calcHandValue(computer);
  } else {
    computer.stand = true;
  }
}



function calcWinner() {
  if (computer.win === 'lose') {
    announceWinner(player);
  } else if (player.win === 'lose') {
    announceWinner(computer);
  } else if (+player.hand > +computer.hand) {
    announceWinner(player);
  } else if (+player.hand === +computer.hand) {
    announceTie();
  } else {
    announceWinner(computer);
  }
}

function announceTie() {
  player.win = 'tie';
  announcement.textContent = "It's a tie!";
  announcement.classList.add('show');
}

function announceWinner(user) {
  user.win = 'win';
  announcement.textContent = `${user.name} wins!`;
  announcement.classList.add('show');
}


hitMe.addEventListener('click', function() {
  createCard(playerCards);
  calcHandValue(player);
});
playerStand.addEventListener('click', function() {
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

function checkWinner(user, total1, total2) {
  if (total1 === 21 || total2 === 21) {
    user.win = 'win';
    disableButtons();
    announceWinner(user);
    console.log(`Blackjack!`);
  } else if (total1 > 21) {
    user.win = 'lose';
    disableButtons();
    calcWinner();
    console.log(player.name + 'lost');
  }
}

function disableButtons() {
  hitMe.setAttribute('disabled', 'true');
  playerStand.setAttribute('disabled', 'true');
}
