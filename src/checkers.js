var board, currentPlayer;

var resetBoard = function () {
  board = [
    [" _ ", " W "," _ "," W "," _ "," W "," _ "," W "],
    [" W "," _ "," W "," _ "," W "," _ "," W "," _ " ],
    [" _ ", " W "," _ "," W "," _ "," W "," _ "," W "],
    [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
    [" _ ", " R "," _ "," R "," _ "," R "," _ "," R "],
    [" R "," _ "," R "," _ "," R "," _ "," R "," _ " ],
    [" _ ", " R "," _ "," R "," _ "," R "," _ "," R "]
  ];

  currentPlayer = ' W '
};

var attemptMove = function (row1, col1, row2, col2) {
  row1 = charToNum[row1];
  row2 = charToNum[row2];
  // Must-Jumps //
  // Check that piece to move belongs to currentPlayer //
  if (board[row1][col1] == currentPlayer) {
  // Check if desired move is on the board  //
    if (row2>=0 && col2>=0 && row2 <=7 && col2 <=7) {

      // If move is to an adjacent forward square, make move //
      if (((row1 == row2+1 && currentPlayer==" R ")| (row1 == row2-1 && currentPlayer==" W ")) && (col1 == col2+1 | col1 == col2-1)) {
        makeMove(row1, col1, row2, col2);
        console.log("You've made a valid move")
    //   // Add else if condition for jumping another player's piece //
    //   // Add double-jump //
        } else {console.log("Not a valid move--Did you move on the diagonal?")}
    } else {console.log("Not a valid move")}
  } else {console.log("You don't have a piece there!")}
}

var makeMove = function(row1, col1, row2, col2) {
  board[row1][col1] = " _ ";
  board[row2][col2] = currentPlayer;
  if (currentPlayer == " W ") {
    currentPlayer = " R ";
  } else {
    currentPlayer = " W ";
  }
  displayBoard();
}