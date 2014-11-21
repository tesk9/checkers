var board, currentPlayer, enemy, taunt_on;
var turnCounter, blackPiecesLeft, redPiecesLeft;
var gameCounter = 0;

var resetBoard = function () {
  board = [
    [" _ ", " B "," _ "," B "," _ "," B "," _ "," B "],
    [" B "," _ "," B "," _ "," B "," _ "," B "," _ " ],
    [" _ ", " B "," _ "," B "," _ "," B "," _ "," B "],
    [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
    [" R "," _ "," R "," _ "," R "," _ "," R "," _ " ],
    [" _ ", " R "," _ "," R "," _ "," R "," _ "," R "],
    [" R "," _ "," R "," _ "," R "," _ "," R "," _ " ]
  ];
  gameCounter++;
  currentPlayer = ' R ';
  enemy = ' B ';
  turnCounter = 1;
  blackPiecesLeft = 12;
  redPiecesLeft = 12;
  taunt_on = prompt("Enter any value if you'd like to play with taunts. They are irritating.");
  // mustJumpsOn = prompt("Enter any value if you'd like to play with must-jumps.");
};

var attemptMove = function (row1, col1, row2, col2) {
  console.log(row1, col1, row2, col2);
  row1 = charToNum[row1];
  row2 = charToNum[row2];
  // Must-Jumps //
  // Check that piece to move belongs to currentPlayer //
  if (board[row1][col1] == currentPlayer) {

    // Check not jumping on top of existing piece //
    if (!(board[row2][col2] !== " _ ")) {

      // Check if desired move is on the board  //
      if (row2>=0 && col2>=0 && row2 <=7 && col2 <=7) {

        // If move is to an adjacent forward square, make move //
        if (((row1 == row2+1 && currentPlayer==" R ")| (row1 == row2-1 && currentPlayer==" B ")) && (col1 == col2+1 | col1 == col2-1)) {
          makeMove(row1, col1, row2, col2);
        } 
          // Jump Conditions: // 
          else if (col1 == col2+2 | col1 == col2-2) {
            jumpConditions(row1, col1, row2, col2);

          }  else { notAllowedMessage("Not a valid move. Adjacent black squares only.") }
      } else { notAllowedMessage("Not a valid move. Stay on the board!") }
    } else {notAllowedMessage("No jumping ON other pieces. Think leapfrog, not dog pile.") }
  } else { notAllowedMessage(currentPlayer+", you don't have a piece there") }
}


var makeMove = function(row1, col1, row2, col2, changePlayer) {
  var piece = kingMe(row1, col1, row2, col2);
  board[row1][col1] = " _ ";
  board[row2][col2] = piece;
  if (currentPlayer == " B " && !changePlayer) {
    currentPlayer = " R ";
    enemy = " B ";
    turnCounter++;
  } else if (!changePlayer){
    currentPlayer = " B ";
    enemy = " R ";
    turnCounter++;
  }
  displayBoard();
  $(document).trigger("boardChange", board);
  gameOver(redPiecesLeft, "White");
  gameOver(blackPiecesLeft, "Black");
}

var removePiece = function(row, col){
  if (board[row][col] === " B "){
    blackPiecesLeft--;
  } else if (board[row][col] === " R "){
    redPiecesLeft--;
  }
  board[row][col] = " _ ";
  taunt(taunt_on);
  $(document).trigger("pieceTaken");
}

var notAllowedMessage = function (message) {
  console.log(message);
  $(document).trigger("invalidMove", message);
}

var taunt = function (taunt){
  var message = "HAHA "+enemy+" lost a piece!!!";
  console.log(message);
  if (taunt){
    alert("HAHA "+enemy+" lost a piece!!!");
    alert("HAHAHAHAHAHHAHA");
  }
}

var changeBoard = function () {
  displayBoard();
  $(document).trigger("boardChange");
}

var gameOver = function (pieces, loser) {
  if (pieces === 0){
    alert("Game over! " + loser + " loses")
    stopPlaying("o"+loser);
  }
}

var jumpConditions = function (row1, col1, row2, col2) {
  var rowJumped = (row1+row2)/2, colJumped = (col2+col1)/2;
  var squareJumped = board[rowJumped][colJumped];
  if ( (currentPlayer === " B " && squareJumped === " R " && row1 == row2-2 ) || (currentPlayer === " R " && squareJumped === " B " && row1 == row2+2) ) {
    removePiece(rowJumped, colJumped);
    makeMove(row1, col1, row2, col2, true);
  } else { 
    notAllowedMessage("You can't jump that! No jumping empty spaces or your own pieces.") 
  }
}

var kingMe = function(row1, col1, row2, col2) {
  var piece = board[row1][col1];
  if (row2 === 0 && piece == " R ") {
    return " r ";
  } else if (row2 === 7 && piece == " B ") {
    return " b ";
  } else {
    return piece;
  }
  
}
