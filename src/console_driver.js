var numToChar = ["a", "b", "c", "d", "e", "f", "g", "h"];
var charToNum = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
}

var displayBoard = function () {
  var column = [0, 1, 2, 3, 4, 5, 6, 7];
  console.log("  | " + column.join("   "));
  console.log("-----------------------------------");
  for (var i = 0; i < board.length; i++) {
    console.log(numToChar[i] + " |" + board[i].join(" "));
  }
  console.log("\n\t\tCurrent player is: " +currentPlayer);
  console.log("\n\t\tThe enemy is: "+enemy);
  console.log("\nThis is turn " + turnCounter);
};

var getMove = function () {
  var startRow = stopPlaying(prompt(currentPlayer+" which piece would you like to move?\nPlease enter ROW"));
  if (startRow){  
    var startColumn = stopPlaying(prompt(currentPlayer+", you've chosen row "+startRow+".\nPlease enter COLUMN"));
  } 
  if (startColumn) {  
    var endRow = stopPlaying(prompt(currentPlayer+", to which row would you like to move "+startRow+", "+startColumn+"?"));
  }
  if (endRow) {
    var endColumn = stopPlaying(prompt(currentPlayer+", to which column would you like to move "+startRow+", "+startColumn+"?"));
  }
  console.log(startRow, startColumn, endRow, endColumn);
  attemptMove(startRow, Number(startColumn), endRow, Number(endColumn));
  getMove();
}

var play = function () {
  resetBoard()
  displayBoard();
  getMove();
}

var stopPlaying = function (input){
  if (input[0] == "q"){
    alert("You've quit the game! "+enemy+"wins by forfeit")
    return;
  } else if (input[0] == "s") {
    getMove()
  } else if(input[0] == "o") {
    console.log(input.splice(1,input.length) + "loses!");
  }else {
    return input;
  }
}
