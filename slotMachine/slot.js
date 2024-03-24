// Import prompt-sync module
const prompt = require("prompt-sync")();

// Define the number of rows and columns
const NUM_ROWS = 3;
const NUM_COLS = 3;

// Define the count of each symbol
const SYMBOL_COUNTS = {
  $: 4,
  o: 6,
  c: 6,
  x: 4,
};

// Define the value of each symbol
const SYMBOL_VALUES = {
  $: 8,
  o: 2,
  c: 5,
  x: 4,
};

// Function to collect deposit amount from the user
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter your deposit: $");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Please enter a valid deposit amount.");
    } else {
      return numberDepositAmount;
    }
  }
};

// Function to get the number of lines to bet on
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("How many lines would you like to bet on? [1-3]: ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Please enter a valid number of lines [1-3].");
    } else {
      return numberOfLines;
    }
  }
};

// Function to collect the bet amount per line
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("How much would you like to bet per line: $");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Please enter a valid bet amount.");
    } else {
      return numberBet;
    }
  }
};

// Function to simulate spinning the slot machine
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNTS)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < NUM_COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < NUM_ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

// Function to transpose the reels
const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < NUM_ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < NUM_COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

// Function to print the rows
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

// Function to calculate winnings
const calculateWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

// Main game function
const startGame = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of: $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = calculateWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won: $" + winnings.toString());

    if (balance <= 0) {
      console.log("You have no more money!");
      break;
    }

    const playAgain = prompt("Would you like to play again?: [y/n]  ");

    if (playAgain != "y") break;
  }
};

// Start the game
startGame();