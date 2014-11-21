var board, currentPlayer, enemy, turnCounter;

var resetBoard = function () {
  board = [
    [" _ ", " W "," _ "," W "," _ "," W "," _ "," W "],
    [" W "," _ "," W "," _ "," W "," _ "," W "," _ " ],
    [" _ ", " W "," _ "," W "," _ "," W "," _ "," W "],
    [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
    [" R "," _ "," R "," _ "," R "," _ "," R "," _ " ],
    [" _ ", " R "," _ "," R "," _ "," R "," _ "," R "],
    [" R "," _ "," R "," _ "," R "," _ "," R "," _ " ]
  ];

  currentPlayer = ' W ';
  enemy = ' R ';
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
        // console.log("You've made a valid move")
      } 
        // Jump Conditions: //
        else if (((row1 == row2+2 && currentPlayer== " R ")| (row1 == row2-2 && currentPlayer==" W ")) && (col1 == col2+2 | col1 == col2-2)){
          var rowJumped = (row1+row2)/2, colJumped = (col2+col1)/2;
          if (board[rowJumped][colJumped] !== " _ ") {
           removePiece(rowJumped,colJumped);
           makeMove(row1, col1, row2, col2);
          } else { notAllowedMessage("You can't jump that!") }
      } else { notAllowedMessage("Not a valid move--Did you move on the diagonal?") }
    } else { notAllowedMessage("Not a valid move") }
  } else { notAllowedMessage("You don't have a piece there!") }
}

var makeMove = function(row1, col1, row2, col2) {
  board[row1][col1] = " _ ";
  board[row2][col2] = currentPlayer;
  if (currentPlayer == " W ") {
    currentPlayer = " R ";
    enemy = " W "
  } else {
    currentPlayer = " W ";
    enemy = " R "
  }
  turnCounter++;
  displayBoard();
  $(document).trigger("boardChange", board);
}

var removePiece = function(row, col){
  board[row][col] = " _ ";
  $(document).trigger("pieceTaken", [currentPlayer, enemy, row, col]);
  taunt();
}

var notAllowedMessage = function (message) {
  console.log(message);
  $(document).trigger("invalidMove", message);
}

var taunt = function (){
  var message = "HAHA "+enemy+" lost a piece!!!";
  console.log(message);
  alert("HAHA "+enemy+" lost a piece!!!");
  alert("HAHAHAHAHAHHAHA");
  $(document).trigger("taunt", message);
}