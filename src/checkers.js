var board, currentPlayer, enemy, taunt_on, mustJumpsOn, playComputer;
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
  message = "There's been an error.";
};


var attemptMove = function (row1, col1, row2, col2) {
  var makeMove = function (row1, col1, row2, col2, changePlayer) {
    var piece = kingMe(row1, col1, row2, col2);
    board[row1][col1] = " _ ";
    board[row2][col2] = piece;
    if (currentPlayer == " B " && changePlayer) {
      if (playComputer) {
        setTimeout(function () {compMove()}, 1000);
      }
    } else if (currentPlayer == " B " && !changePlayer) {
      currentPlayer = " R ";
      enemy = " B ";
      turnCounter++;
    } else if (!changePlayer) {
      currentPlayer = " B ";
      enemy = " R ";
      turnCounter++;
      if (playComputer) {
        setTimeout(compMove(), 1000);
      }
    }
  }
  var moveMade = function (row1, col1, row2, col2) {
    $(document).trigger("movePiece", [row1, col1, row2, col2])
    setTimeout(function(){changeBoard()}, 1000);
    gameOver(redPiecesLeft, "Red");
    gameOver(blackPiecesLeft, "Black");
  }
  
  row1 = charToNum[row1];
  row2 = charToNum[row2];
  var moveCheck = moveLegal(row1, col1, row2, col2);
  if (typeof(moveCheck) === "object") {
    makeMove(row1, col1, row2, col2, true);
    removePiece(moveCheck[4], moveCheck[5]);
    moveMade(row1, col1, row2, col2);
  } else if (moveCheck) {
    if (mustJumpsOn) {
      var jumpsOpen = mustJump();
      if (jumpsOpen == 0) {
        makeMove(row1, col1, row2, col2);
        moveMade(row1, col1, row2, col2);
      } else {
        message = "Not a valid move!\nYou're playing with must-jumps.\nThat means that if there are jumps available, you have to take them.";
        notAllowedMessage();
      }
    } else {
        makeMove(row1, col1, row2, col2);
        moveMade(row1, col1, row2, col2);
    }
  } else {
    notAllowedMessage();
    message = "There's been an error."
  }
}

var moveLegal = function (row1, col1, row2, col2) {
  var isLegalJump = function () {
    var piece = board[row1][col1];
    var rowJumped = (row1+row2)/2, colJumped = (col1+col2)/2;
    var squareJumped = board[rowJumped][colJumped];
    if ( (currentPlayer === " B " && (squareJumped === " R "|| squareJumped ===" r ") && row1 == row2-2 ) || (currentPlayer === " R " && (squareJumped === " B "|| squareJumped === " b ") && row1 == row2+2) ) {
      return [row1, col1, row2, col2, rowJumped, colJumped];
    } else if (piece === currentPlayer.toLowerCase() && (squareJumped !== currentPlayer) && (squareJumped !== currentPlayer.toLowerCase()) && squareJumped !== " _ " && (row1 === row2 + 2 || row1 === row2 - 2)) {
      return [row1, col1, row2, col2, rowJumped, colJumped];
    } else { 
      message = "You can't jump that! No jumping empty spaces or your own pieces.";
      return false;
    }
  }

  var isOnBoard = function () {
    if (row2>=0 && col2>=0 && row2 <=7 && col2 <=7) {
      return true;
    } else { 
      message = "Not a valid move. Stay on the board!";
      return false;
    }
  }

  var isRightTurn = function () {
    if (board[row1][col1].toLowerCase() === currentPlayer.toLowerCase()) {
      return true;
    } else {
      message = currentPlayer+", it's your turn. You don't have a piece there.";
      return false;
    }
  }

  var isNotJumpOn = function () {
    if (!(board[row2][col2] !== " _ ")) {
      return true;
    } else {
      message = "No jumping ON other pieces. Think leapfrog, not dog pile.";
      return false;
    }
  }

  var isAdjacent = function () {
    if ( col1 === col2+1 || col1 === col2-1) {
      return true;
    } 
  }

  var isForwardOrKing = function () {
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

  if (isOnBoard() && isRightTurn() && isNotJumpOn()) {
    if (isAdjacent(row1, col1, row2, col2)) {
      if (isForwardOrKing(row1, col1, row2, col2)) {
        return true;
      }
    } else if (col1 === col2+2 || col1 === col2-2){
      return isLegalJump(row1, col1, row2, col2)
    }
  }
  return false;
};


var removePiece = function (row, col) {
  if (board[row][col].toLowerCase() === " b "){
    blackPiecesLeft--;
  } else if (board[row][col].toLowerCase() === " r "){
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

var taunt = function (taunt) {
  var message = "HAHA "+enemy+" lost a piece!!!";
  console.log(message);
  if (taunt){
    alert("HAHA "+enemy+" lost a piece!!!");
    alert("HAHAHAHAHAHHAHA");
  }
}

var changeBoard = function () {
  displayBoard();;
  $(document).trigger("boardChange")
}

var gameOver = function (pieces, loser) {
  if (pieces === 0){
    alert("Game over! " + loser + " loses")
    stopPlaying("o"+loser);
  }
}

var kingMe = function (row1, col1, row2, col2) {
  var piece = board[row1][col1];
  if (row2 === 0 && piece == " R ") {
    return " r ";
  } else if (row2 === 7 && piece == " B ") {
    return " b ";
  } else {
    return piece;
  } 
}

var mustJump = function () {
  var possMoves = [];
  var row = 0;
  for (row; row < 8; row++) {
    checkByRow(row, possMoves, 2, checkIfLegal);
  }
  return possMoves;
}

var checkByRow = function (row, possMoves, every, func) {
  var col = 0;
  for (col; col < 8; col++) {
    func(row, col, row+every, col+every, possMoves);
    func(row, col, row-every, col-every, possMoves);
    func(row, col, row+every, col-every, possMoves);
    func(row, col, row-every, col+every, possMoves);      
  }
}

// Returns legal jump moves //
var checkIfLegal = function (row, col, addRow, addCol, movesArray) {
  var moveCheck = moveLegal(row, col, addRow, addCol);
  if (typeof(moveCheck) === "object"){
    movesArray.push([row,col,addRow,addCol]);
  }
  return movesArray;
}

// Returns legal non-jump moves //
var checkIfLegal2 = function (row, col, addRow, addCol, movesArray) {
  var moveCheck = moveLegal(row, col, addRow, addCol);
  if (moveCheck === true){
    movesArray.push([row,col,addRow,addCol]);
  }
  return movesArray;
}

var getCompOptions = function () {
  var compMoveOptions = mustJump();
  if (compMoveOptions.length === 0) {
    var row = 0;
    for (row; row < 8; row++) {
      checkByRow(row, compMoveOptions, 1, checkIfLegal2);
    }
  }
  var findMoveInArray = Math.floor(Math.random() * compMoveOptions.length);
  var randomMove = compMoveOptions[findMoveInArray];
  return randomMove;
}

var compMove = function () {
  var moveTo = getCompOptions();
  console.log(moveTo)
  setTimeout(function(){
    attemptMove(numToChar[moveTo[0]], moveTo[1], numToChar[moveTo[2]], moveTo[3])
  }, 700);
}

