var board, currentPlayer, enemy, taunt_on;
var turnCounter, blackPiecesLeft, redPiecesLeft;
var gameCounter = 0;
var message;

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
  message = "There's been an error."
  // taunt_on = prompt("Enter any value if you'd like to play with taunts. They are irritating.");
  // mustJumpsOn = prompt("Enter any value if you'd like to play with must-jumps.");
};


var moveMade = function(){
  displayBoard();
  $(document).trigger("boardChange");
  gameOver(redPiecesLeft, "White");
  gameOver(blackPiecesLeft, "Black");
}

var attemptMove = function(row1, col1, row2, col2) {
  row1 = charToNum[row1];
  row2 = charToNum[row2];
  var moveCheck = moveLegal(row1, col1, row2, col2);
  if (typeof(moveCheck) === "object") {
    makeMove(row1, col1, row2, col2, true);
    removePiece(moveCheck[4], moveCheck[5]);
    moveMade();
  } else if (moveCheck) {
    makeMove(row1, col1, row2, col2);
    moveMade();
  } else {
    notAllowedMessage();
    message = "There's been an error."
  }
}

var jumpConditions = function (row1, col1, row2, col2) {
    var piece = board[row1][col1];
    var rowJumped = (row1+row2)/2, colJumped = (col1+col2)/2;
    var squareJumped = board[rowJumped][colJumped];
    if ( (currentPlayer === " B " && (squareJumped === " R "|| squareJumped ===" r ") && row1 == row2-2 ) || (currentPlayer === " R " && (squareJumped === " B "|| squareJumped === " b ") && row1 == row2+2) ) {
      return [row1, col1, row2, col2, rowJumped, colJumped];
    } else if (piece === currentPlayer.toLowerCase() && (squareJumped !== (currentPlayer||currentPlayer.toLowerCase())) && (row1 === row2 + 2 || row1 === row2 - 2)) {
      return [row1, col1, row2, col2, rowJumped, colJumped];
    } else { 
      message = "You can't jump that! No jumping empty spaces or your own pieces.";
      return false;
    }
  }


var onBoard = function (row1, col1, row2, col2) {
  if (row2>=0 && col2>=0 && row2 <=7 && col2 <=7) {
    return true;
  } else { 
    message = "Not a valid move. Stay on the board!";
    return false;
  }
}

var rightTurn = function (row1, col1) {
  if (board[row1][col1].toLowerCase() === currentPlayer.toLowerCase()) {
    return true;
  } else {
    message = currentPlayer+", it's your turn. You don't have a piece there.";
    return false;
  }
}

var noJumpOns = function (row2, col2) {
  if (!(board[row2][col2] !== " _ ")) {
    return true;
  } else {
    message = "No jumping ON other pieces. Think leapfrog, not dog pile.";
    return false;
  }
}

var isAdjacent = function (row1, col1, row2, col2) {
  if ( col1 === col2+1 || col1 === col2-1) {
    return true;
  } 
}

var forwardOrKing = function (row1, col1, row2, col2) {
  if ((row1 == row2+1 && currentPlayer==" R ") || (row1 == row2-1 && currentPlayer==" B ")) {
    return true;
  } else if (row1 === row2+1 || row1 === row2-1){
    if (board[row1][col1] === currentPlayer.toLowerCase()) {
      return true;
    } else {
      message = "Your piece hasn't been kinged! It needs to be a king to move backwards.";
    }
  } else {
    message = "Not a valid move. Adjacent black squares only.";
  }
}

var moveLegal = function (row1, col1, row2, col2) {
  if (onBoard(row1, col1, row2, col2)) {
    if (rightTurn(row1, col1)) {
      if (noJumpOns(row2, col2)) {
        if (isAdjacent(row1, col1, row2, col2)) {
          if (forwardOrKing(row1, col1, row2, col2)) {
            return true;
          }
        } else if (col1 === col2+2 || col1 === col2-2){
          return jumpConditions(row1, col1, row2, col2)
        }
      }
    } 
  } else {
    return false;
  }
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

var notAllowedMessage = function () {
  console.log(message);
  $(document).trigger("invalidMove");
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

// var mustJump = function () {
//   board.forEach(checkByRow);
//   var possMoves = [];
//   var checkByRow = function (row) {
//     var startPos = 0;
//     for (startPos; i < 8; i++){
//       // if (){}
//     }
//   }
// }