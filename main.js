// Create array with deck of 52 cards
//   Loop to automate card name, suit, value, available
// Object - name, suit, value
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

  // Assign numerical value to cards: 1-9 is same as number version of 'name'
  if (i < 32) {
    tempCard.value = +cardName[cardNameCounter];
  } // Assign 2 values to ace cards
  else if (i >= 48) {
    tempCard.value = 1;
    tempCard.altValue = 11;
  } // Assign numerical value 10 to cards 10, J, Q, K
  else {
    tempCard.value = 10;
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
let playerWin = false;
let computerWin = false;

// 2. Function: randomly select card from array
//   Create div with object / card's properties
//   Position according to which player it is, append to container
//   Remove card from available cards in deck

// Randomly generate an index number of the deck
function randomCardNo() {
  // To test randomCardNo function:
  // for (let i = 0; i < 52; i += 2) {
  //   deck[i].available = "in play";
  // }
  let tempNo = Math.floor(Math.random() * 52);
  if (deck[tempNo].available === 'available') {
    console.log('card available');
    console.log(tempNo);
    return tempNo;
  } else {
    console.log('card in play, try again');
    return randomCardNo();
  }
}

let counter = 0;
// Function to create cards
const createCard = (personCards) => {
  counter++;
  const card = document.createElement('div');
  card.classList.add('card');
  const deckIndex = randomCardNo();
  card.innerHTML = `<p>${deck[deckIndex].name}${deck[deckIndex].suit}`;
  if (deck[deckIndex].suit === 'D' || deck[deckIndex].suit === 'H') {
    card.classList.add('red');
  }
  personCards.appendChild(card);
  deck[deckIndex].available = "in play";
}


// while (!playerWin && !computerWin) {
  while (counter < 4) {
    createCard(playerCards);
    createCard(computerCards);
  }
// }