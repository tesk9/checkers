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
      if (element[i] === ' W ') {
        // console.log("Something is W")
        $square.append("<span class=piece></span>");
        $(".piece").addClass('white');
      } else if (element[i] === ' R ') {
        // console.log("something is R")
        $square.append("<span class=piece></span>")
        $('.piece').addClass('red');
      } else {
      }
    }
  }

  // $(".row .col").on("click", function() {
  //   // $col = $(this).closest("col").className;
  //   $col = $(this).closest(".col").html();
  //   $row = $(this).parent(".row").html();
  //   console.log($col);
  //   console.log($row);
  // });

});

