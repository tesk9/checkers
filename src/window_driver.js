$(document).ready(function(){
  $(".start").on("click", function(){
    console.log("You've pressed start")
    resetBoard();
    changeBoard();
  });

  $(document).on("boardChange", function (e, board1, board2, board3, board4, board5, board6, board7, board8){
    var board = [board1, board2, board3, board4, board5, board6, board7, board8]
    board.forEach(eachRow);
  });

  $(document).on("invalidMove", function (e, message){
    alert(message);
  });

  var eachRow = function (element, index, array) {
    $row = $(".row-"+numToChar[index]);

    for (var i = 0; i<8; i++){
      var $square = $row.find('.col-'+i);
      if (element[i] === ' B ') {
        $square.find("span").remove("span");
        $square.append("<span class=piece></span>");
        $square.find(".piece").addClass('black');
      } else if (element[i] === ' R ') {
        $square.find("span").remove("span");
        $square.append("<span class=piece></span>")
        $square.find('.piece').addClass('red');
      } else {
        $square.find("span").remove("span");
      }
    }
  }

  var moveSelection = []
  $(".row .col").on("click", function() {
    var col = $(this)[0].classList[1];
    var row = $(this).parent("span").get(0).classList[1];

    var getBoardIndex = function (selector) {
      return selector.charAt(selector.length - 1);
    }
    moveSelection.push(getBoardIndex(row),getBoardIndex(col));
    console.log(moveSelection);
    if (moveSelection.length === 4) {
      attemptMove(moveSelection[0], Number(moveSelection[1]), moveSelection[2], Number(moveSelection[3]));
      moveSelection = [];
    }
  });

});

