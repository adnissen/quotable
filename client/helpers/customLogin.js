Template.customLogin.events({
  'click #customLoginSignin': function(){
    if ($('#customLoginUsername').val().length != 0 && $('#customLoginPassword').val().length != 0){
      Meteor.loginWithPassword($('#customLoginUsername').val().toLowerCase(), $('#customLoginPassword').val(), function(err){
        if (Meteor.user()){
          Blaze.remove(currentScreen);
          currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
        }
      });
    }
  },

  'click #customLoginCreate': function(){
    if ($('#customLoginUsername').val().length != 0 && $('#customLoginPassword').val().length != 0){
      Accounts.createUser({username: $('#customLoginUsername').val().toLowerCase(), password: $('#customLoginPassword').val()}, function(err){
        if (err)
        return;
      Meteor.loginWithPassword($('#customLoginUsername').val().toLowerCase(), $('#customLoginPassword').val(), function(err){
        if (Meteor.user()){
          Blaze.remove(currentScreen);
          currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
        }
      });
      });
    }
  },

  'click img': function(){
    addToHomescreen();
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
