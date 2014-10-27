Template.customLogin.quotesTotal = function(){
  Meteor.call('getQuotesTotal', function(e, d){
    Session.set('quotesTotal', d);
  });
  return Session.get('quotesTotal');
}

Template.customLogin.events({
  'click #customLoginSignin': function(){
    if ($('#customLoginUsername').val().length != 0 && $('#customLoginPassword').val().length != 0){
      Meteor.loginWithPassword($('#customLoginUsername').val().toLowerCase(), $('#customLoginPassword').val(), function(err){
        if (Meteor.user()){
          Router.go('/');
        }
      });
    }
  },

  'click #customLoginCreate': function(){
    if ($('#customLoginUsername').val().length != 0 && $('#customLoginPassword').val().length != 0){
      Accounts.createUser({username: $('#customLoginUsername').val().toLowerCase(), password: $('#customLoginPassword').val()}, function(err){
        if (err)
          return;
        keen.addEvent('signups', {username: $('#customLoginUsername').val().toLowerCase(), timestamp: new Date().toISOString()});
        Meteor.loginWithPassword($('#customLoginUsername').val().toLowerCase(), $('#customLoginPassword').val(), function(err){
          if (Meteor.user()){
            Router.go('/');
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
