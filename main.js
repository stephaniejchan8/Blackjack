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
for (let i = 0; i < 52; i++) {
  // Declare a temp card object
  const card = new Object();

  // Assign all cards available 
  card.available = 'available';

  // Change 'name' of card every 4 cards
  if (i !== 0 && i % 4 === 0) {
    cardNameCounter++;
  }
  card.name = cardName[cardNameCounter];

  // Assign numerical value to cards: 1-9 is same as number version of 'name'
  if (i < 32) {
    card.value = +cardName[cardNameCounter];
  } // Assign 2 values to ace cards
  else if (i >= 48) {
    card.value = 1;
    card.altValue = 11;
  } // Assign numerical value 10 to cards 10, J, Q, K
  else {
    card.value = 10;
  }

  // Assign 1 of 4 suits to cards with the same name
  if (i % 4 === 0) {
    card.suit = cardSuit[0];
  } else if (i % 4 === 1) {
    card.suit = cardSuit[1];
  } else if (i % 4 === 2) {
    card.suit = cardSuit[2];
  } else {
    card.suit = cardSuit[3];
  }

  // Push temp card object to deck array
  deck.push(card);
}
console.log(deck);