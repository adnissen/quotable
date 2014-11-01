Template.resetPassword.events({
  'click #resetPasswordSubmit': function(){
    Accounts.forgotPassword({email: $('#resetPasswordLoginEmail').val()}, function(){
      swal('Recovery Email Sent!', "You're seconds away from being able to quote again. You should be recieving a password reset link any second.", 'success');
    });
  }
});
