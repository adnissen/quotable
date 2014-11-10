Template.customLogin.quotesTotal = function(){
  Meteor.call('getQuotesTotal', function(e, d){
    Session.set('quotesTotal', d);
  });
  return Session.get('quotesTotal');
}

Template.customLogin.events({
  'click #customLoginSignin': function(){
    Meteor.loginWithPassword($('#customLoginUsername').val().toLowerCase(), $('#customLoginPassword').val(), function(err){
      if (err)
        swal('Uh-oh', "That's not a valid username or password!", "error");
      //keen.addEvent('logins', {username: $('#customLoginUsername').val().toLowerCase()});
      console.log('redirecting them to the homepage');
      Meteor.subscribe("userData");
      $('.topcoat-navigation-bar').show();
      $('.content').css('top', 70);
      Router.go('/');
    });
  },
  'click img': function(){
    addToHomescreen();
  },
  'click #customLoginForgot': function(){
    if (currentScreen)
      Blaze.remove(currentScreen);
    currentScreen = Blaze.render(Template.resetPassword, document.getElementById('content'));
  },
  'click .welcomeScreenSignUp': function(){
    if (currentScreen)
      Blaze.remove(currentScreen);
    currentScreen = Blaze.render(Template.customSignup, document.getElementById('content'));
  }
});

Template.homeScreen.events({
  'click #menuQuote': function() {
    if (Session.get('activeQuoteMenu') === true){
      Blaze.remove(quoteView);
      Session.set('activeQuoteMenu', false);
      return;
    }
    else{
      quoteView = Blaze.render(Template.quoteControls, document.getElementById('menuQuoteDiv'));
      Session.set('activeQuoteMenu', true);
      return;
    }
  }
});
