// Create array with deck of 52 cards
//   Loop to automate card name, suit, cardValue, available
// Object - name, suit, cardValue
//   ? available(or you could make 2 arrays - dealing deck array and a base deck array)

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
  win: false,
  stand: false
};
const computer = {
  win: false,
  stand: false
};


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
  card.innerHTML = `<p>${deck[deckIndex].name}${deck[deckIndex].suit}`;
  if (deck[deckIndex].suit === 'D' || deck[deckIndex].suit === 'H') {
    card.classList.add('red');
  }
  card.dataset.cardValue = deck[deckIndex].cardValue;
  if (deck[deckIndex].altCardValue) {
    card.dataset.altCardValue = deck[deckIndex].altCardValue;
  }
  personCards.appendChild(card);
  //   Remove card from available cards in deck
  deck[deckIndex].available = "in play";
}

while (!player.win && !computer.win) {
  for (let i = 0; i < 2; ++i) {
    createCard(playerCards);
    createCard(computerCards);
  }
  // if (playerStand === true) {

  // }
  // Temporary measure to stop an infinite loop
  player.win = true;
}

// 7. Function: calculate each user's total hand cardValue
// If total = 21 = user wins
// Allow for 2 + totals(ace card)
const calcHandValue = (user) => {
  const cardsArray = document.querySelectorAll(`.${user}Cards .card`);
  let total = 0;
  let altTotal = 0;
  let altAce = false;
  for (let i = 0; i < cardsArray.length; ++i) {
    // First attempt:
    // if (altAce) {
    //   altTotal += +cardsArray[i].dataset.cardValue;
    //   console.log('altTotal increased')
    // }
    // else if (!altAce && cardsArray[i].dataset.altCardValue) {
    //   altTotal = total + +cardsArray[i].dataset.altCardValue;
    //   altAce = true;
    //   console.log('altTotal created: ', altTotal);
    // }
    total += +cardsArray[i].dataset.cardValue;
    if (cardsArray[i].dataset.altCardValue) {
      altAce = true;
    }
  }
  console.log(`${user} hand value: `, total);
  if (altAce) {
    altTotal = total + 10;
    console.log(`${user} alt hand value: `, altTotal);
  }
  if (total === 21 || altTotal === 21) {
    // user.win = true; - needs to be fixed
    // console.log(user.win);
    console.log(`Blackjack! ${user} won the game!`);
  }
}
calcHandValue("computer");
calcHandValue("player");