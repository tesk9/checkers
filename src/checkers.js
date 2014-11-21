var board, currentPlayer, enemy;
var turnCounter = 1, blackPiecesLeft = 1, redPiecesLeft = 2;

var resetBoard = function () {
  // board = [
  //   [" _ ", " B "," _ "," B "," _ "," B "," _ "," B "],
  //   [" B "," _ "," B "," _ "," B "," _ "," B "," _ " ],
  //   [" _ ", " B "," _ "," B "," _ "," B "," _ "," B "],
  //   [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
  //   [" _ "," _ "," _ "," _ ", " _ "," _ "," _ "," _ "],
  //   [" R "," _ "," R "," _ "," R "," _ "," R "," _ " ],
  //   [" _ ", " R "," _ "," R "," _ "," R "," _ "," R "],
  //   [" R "," _ "," R "," _ "," R "," _ "," R "," _ " ]
  // ];
  // Board to test near-victory conditions //
    board = [
    [" _ "," _ "," _ "," _ "," _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ "," _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," B "," _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ "," R "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ "," _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ "," _ "," _ "," R "," _ "],
    [" _ "," _ "," _ "," _ "," _ "," _ "," _ "," _ "],
    [" _ "," _ "," _ "," _ "," _ "," _ "," _ "," _ "]
  ];

  currentPlayer = ' B ';
  enemy = ' R ';
};

var attemptMove = function (row1, col1, row2, col2) {
  console.log(row1, col1, row2, col2);
  row1 = charToNum[row1];
  row2 = charToNum[row2];
  // Must-Jumps //
  // Check that piece to move belongs to currentPlayer //
  if (board[row1][col1] == currentPlayer) {
  // Check if desired move is on the board  //
    if (row2>=0 && col2>=0 && row2 <=7 && col2 <=7) {

      // If move is to an adjacent forward square, make move //
      if (((row1 == row2+1 && currentPlayer==" R ")| (row1 == row2-1 && currentPlayer==" B ")) && (col1 == col2+1 | col1 == col2-1)) {
        makeMove(row1, col1, row2, col2);
        // console.log("You've made a valid move")
      } 
        // Jump Conditions: // 
        else if (col1 == col2+2 | col1 == col2-2){
          var rowJumped = (row1+row2)/2, colJumped = (col2+col1)/2;
          if ((row1 == row2+2 && currentPlayer== " R " && board[rowJumped][colJumped] === " B ")||(row1 == row2-2 && currentPlayer==" B " && board[rowJumped][colJumped] === " R ")) {
            removePiece(rowJumped,colJumped);
            makeMove(row1, col1, row2, col2);

          } else { notAllowedMessage("You can't jump that! No jumping empty spaces or your own pieces.") }
      } else { notAllowedMessage("Not a valid move. Black squares only.") }
    } else { notAllowedMessage("Not a valid move. Stay on the board!") }
  } else { notAllowedMessage("You don't have a piece there!") }
}

var makeMove = function(row1, col1, row2, col2) {
  board[row1][col1] = " _ ";
  board[row2][col2] = currentPlayer;
  if (currentPlayer == " B ") {
    currentPlayer = " R ";
    enemy = " B ";
  } else {
    currentPlayer = " B ";
    enemy = " R ";
  }
  turnCounter++;
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
  // $(document).trigger("pieceTaken", [currentPlayer, enemy, row, col]);
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
}

var changeBoard = function () {
  displayBoard();
  $(document).trigger("boardChange", board);
}

var gameOver = function (pieces, loser) {
  if (pieces === 0){
    alert("Game over! " + loser + " loses")
    stopPlaying("o"+loser);
  }
}

