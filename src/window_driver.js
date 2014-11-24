$(document).ready(function(){
  $(".start").on("click", function(){
    console.log("You've pressed start")
    $(".turn .turn").remove();
    $(".turn").append('<span class="turn">This is turn: </span>');
    resetBoard();
    changeBoard();
    $(".start").text("New Game");
  });

 $(document).on("boardChange", function (e){
    board.forEach(eachRow);
    $(".m").remove();
    $(".counter").remove();
    $(".player").remove();
    $(".currentPlayer").append("<span class='player'>It's "+currentPlayer+"'s turn.</span>")
    $(".turn .turn").append("<span class='counter'>"+turnCounter+"</span>");
    $(".games").remove(".counter")
    $(".games").append("<span class='counter'>"+gameCounter+"</span>")
  });

  $(document).on("invalidMove", function (e){
    $(".m").remove();
    $(".message").append("<span class='m'>"+message+"</span>");
  });

  var eachRow = function (element, index, array) {
    $row = $(".row-"+numToChar[index]);

    for (var i = 0; i<8; i++){
      var $square = $row.find('.col-'+i);
      $square.find("span").remove("span");
      $square.append("<span class=piece></span>")
      if (element[i] === ' B ') {
        $square.find(".piece").addClass('black');
      } else if (element[i] === ' R ') {
        $square.find('.piece').addClass('red');
      } else if (element[i] === ' b ') {
        $square.find('.piece').addClass('black bKing');
      } else if (element[i] === ' r ') {
        $square.find('.piece').addClass('red rKing');
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
    } else if (moveSelection.length > 4) {
      moveSelection = [];
    }
  });

  $(document).on("pieceTaken", function (e){
    $(this).find(".l").remove();
    var blackPiecesTaken = 12 - blackPiecesLeft;
    var redPiecesTaken = 12 - redPiecesLeft;
    $(this).find(".b").append("<span class='l'>" + blackPiecesTaken + "</span>");
    $(this).find(".r").append("<span class='l'>" + redPiecesTaken + "</span>");
    // $(document).trigger("boardChange");
  });

});

