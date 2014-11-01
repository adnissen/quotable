Template.newPassword.events({
  'click #newPasswordSubmit': function(){
    Accounts.resetPassword(Session.get('token'), $('#newPasswordPassword').val(), function(){
      Router.go('/');
    });
  }
});
