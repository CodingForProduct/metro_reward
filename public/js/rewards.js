$(document).ready(function() {

  var totalPoints = parseInt($(".circle").text());
  var redeemPoints;

  // Modal to confirm which item has been selected
  var modalConfirm = function(callback){
    $(".reward-item").on("click", function(){
      $(this).children();
      console.log("Hey");
      $(".pts-redeemed").html($(".points-needed p:first").text());
      $("#item-redeemed").html($(".vendor-reward p:first").text());

      redeemPoints = parseInt($(".points-needed p:first").text());
      $("#confirm-modal").modal('show');
    });

    $("#modal-btn-confirm").on("click", function(){
      callback(true);
      $("#confirm-modal").modal('hide');
    });

    $("#modal-btn-cancel").on("click", function(){
      callback(false);
      $("#confirm-modal").modal('hide');
    });
  };

  modalConfirm(function(confirm){
    if(confirm){
      // Placeholder in case we want to alter the rendered page
      // $("#result").html("item selected");
      totalPoints = getBalance(totalPoints, redeemPoints);
      alert(totalPoints);


    }else{
      // Placeholder in case we want to alter the rendered page
      // $("#result").html("cancelled");
    }
  });

  // Modal to confirm points deduction
  var redeemConfirm = function(callback){
    $("#modal-btn-confirm").on("click", function(){
      $("#success-modal").modal('show');
    });

    $("#modal-btn-close").on("click", function(){
      callback(true);
      $("#success-modal").modal('hide');
    });

    $("#modal-btn-close").on("click", function(){
      callback(false);
      $("#success-modal").modal('hide');
    });
  };

  redeemConfirm(function(confirm){
    if(confirm){
      // Placeholder in case we want to alter the rendered page
      // $("#result").html("redemption confirmed");
    }else{
      // Placeholder in case we want to alter the rendered page
      // $("#result").html("cancelled");
    }
  });

}); // Close document ready function
