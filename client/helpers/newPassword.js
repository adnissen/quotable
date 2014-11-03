Template.newPassword.events({
  'click #newPasswordSubmit': function(){
    Accounts.resetPassword(Session.get('token'), $('#newPasswordPassword').val(), function(){
      swal('You did it!', "Your password has been reset! Get back to quoting!", 'success');
      Router.go('/');
    });
  }
});
