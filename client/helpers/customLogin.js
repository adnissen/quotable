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
      if (Meteor.user()){
        Meteor.subscribe("userData");
        Router.go('/');
      }
    });
  },

  'click #customLoginCreate': function(){
    if ($('#customLoginUsername').val().length != 0 && $('#customLoginPassword').val().length != 0){
      Accounts.createUser({username: $('#customLoginUsername').val().toLowerCase(), password: $('#customLoginPassword').val()}, function(err){
        if (err)
          swal('Oops', "That username is already taken!", "error");
        keen.addEvent('signups', {username: $('#customLoginUsername').val().toLowerCase(), timestamp: new Date().toISOString()});
        Meteor.loginWithPassword($('#customLoginUsername').val().toLowerCase(), $('#customLoginPassword').val(), function(err){
          if (Meteor.user()){
            Meteor.subscribe("userData");
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
