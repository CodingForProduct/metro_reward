$(document).ready(function() {
  validate();
  $("input").on("blur", validate);
});

// Form Error Messages
var firstError = $("#firstError");
var lastError = $("#lastError");
var emailError = $("#emailError");
var tapError = $("#tapError");
var pwError = $("#pwError");
var pwMatchError = $("#pwMatchError");

// Validators
var firstValid = false;
var lastValid = false;
var emailValid = false;
var tapValid = false;
var pwValid = false;
var pwMatchValid = false;

function validate() {
  // VALIDATE FIRST NAME IS NOT EMPTY
  $("#firstname").on("blur", function() {
    var value = $(this).val();
    if (value.length < 1 ) {
        $("#firstError").text("Please enter your first name!").removeClass("validEntry");
        firstValid = false;
    } else {
        $("#firstError").text("OK!").addClass("validEntry");
        firstValid = true;
    }
  })

  // VALIDATE LAST NAME IS NOT EMPTY
  $("#lastname").on("blur", function() {
    var value = $(this).val();
    if (value.length < 1 ) {
        $("#lastError").text("Please enter your last name!").removeClass("validEntry");
        lastValid = false;
    } else {
        $("#lastError").text("OK!").addClass("validEntry");
        lastValid = true;
    }
  })

  // VALIDATE EMAIL AS VALID EMAIL ADDRESS
  $("#email").on("blur", function() {
    var email = $(this).val();
    if (validateEmail(email) == false) {
      $("#emailError").text("Must be a valid email address!").removeClass("validEntry");
      emailValid = false;
    } else {
      $("#emailError").text("OK!").addClass("validEntry");
      emailValid = true;
    }
  })

  // VALIDATE EMAIL AS UNIQUE - REQUIRES AJAX API ENDPOINT TO BE ADDED LATER
  // $("#email").on("blur", function() {
  //   var email = $(this).val();
  //   if (queryEmail(email) == true) {
  //     $("#emailError").text("Email must be unique!").removeClass("validEntry");
  //     emailValid = false;
  //   } else {
  //     $("#emailError").text("OK!").addClass("validEntry");
  //     emailValid = true;
  //   }
  // })
  // function queryEmail(email) {
  //   User.findOne({where: {username: email}}, function (err, existingUser) {
  //     if (err) {
  //       console.log(err);
  //     } else if (existingUser) {
  //       return true;
  //     } return false;
  //   });
  // }

  // VALIDATE TAP NUMBER AS 16 CHARACTERS
  $("#tap_id").on("blur", function() {
    var value = $(this).val();
    if (value.length != 16 ) {
        $("#tapError").text("Must have 16 characters!").removeClass("validEntry");
        tapValid = false;
    } else {
        $("#tapError").text("OK!").addClass("validEntry");
        tapValid = true;
    }
  })

  // VALIDATE PASSWORD BETWEEN 6-30 characters
  $("#password").on("blur", function() {
    var value = $(this).val();
    if (value.length < 6 || value.length > 30 ) {
        $("#pwError").text("Password must be between 6-30 characters!").removeClass("validEntry");
        pwValid = false;
    } else {
        $("#pwError").text("OK!").addClass("validEntry");
        pwValid = true;
    }
  })

  // VALIDATE PASSWORDS MATCH
  $("#passwordConfirm").on("blur", function() {
    var pw1 = $("#password").val();
    var pw2 = $(this).val();
    if (pw1 != pw2) {
        $("#pwMatchError").text("Passwords must match!").removeClass("validEntry");
        pwMatchValid = false;
    }
    else {
        $("#pwMatchError").text("OK!").addClass("validEntry");
        pwMatchValid = true;
    }
  })

  // COUNT COMPLETED INPUT FIELDS
  var completedInputs = 0;
  var inputs = $("input");

  inputs.each(function() {
    if ($(this).val()) {
      completedInputs += 1;
    }
  });

  // ENABLE SUBMIT BUTTON IFF FORM ENTRIES ARE VALID
  if (completedInputs == inputs.length
    && firstValid == true
    && lastValid == true
    && emailValid == true
    && tapValid == true
    && pwValid == true
    && pwMatchValid == true) {
    $("#signupSubmit").prop("disabled", false);
  } else {
    $("#signupSubmit").prop("disabled", true);
  }
} //close validate function

function validateEmail(address) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(address)) {
    return (true)
  } return (false)
}
