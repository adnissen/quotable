Meteor.subscribe("userData");
Meteor.subscribe("quotes");
Session.setDefault("counter", 0);
Quotes = new Mongo.Collection("quotes");

Meteor.startup(function(){
  $(function() {
    $('#quoteAddedModal').easyModal({overlayColor: "#333"});
  });
  Session.setDefault('activeQuoteMenu', false);
  if (Meteor.userId()){
    currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
  }
  else{
    currentScreen = Blaze.render(Template.customLogin, document.getElementById('content'));
  }
});

Template.headerView.helpers({
  render: function(){
   
  }
});

Template.quoteControls.rendered = function(){
  $('#quoteEntry').show();
  $('#quoteEntry').addClass('animated fadeIn');
  $('#submitQuote').addClass('animated bounceInDown');
  $('#userEntry').addClass('animated fadeIn');
};

Template.customLogin.events({
  'click #customLoginButton': function(){
    Meteor.loginWithTwitter(function(){
      Blaze.remove(currentScreen);
      currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
    });
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
  },

  'click #menuViewQuotes': function(){
    $('#homeScreen').addClass('animated bounceOutLeft');
    $('#homeScreen').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){ 
      lastView = Blaze.getView(document.getElementById('homeScreen'))
      Blaze.remove(lastView);
      currentScreen = Blaze.render(Template.viewQuotesTemplate, document.getElementById('content'));
      console.log("finished, finally");
      $('#viewQuotesDiv').addClass("animated bounceInRight");
    });
  }
});

Template.viewQuotesTemplate.events({
  'click #backToHome': function(){
    $('#viewQuotesDiv').addClass("animated bounceOutRight");
    $('#viewQuotesDiv').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){ 
      Blaze.remove(currentScreen);
      Blaze.render(Template.homeScreen, document.getElementById('content'));
      $('#homeScreen').addClass("animated bounceInLeft");
    });
  }
});

Template.singleQuoteTemplate.quote = function(){
  return Quotes.findOne({_id: Session.get('lastQuote')});
};

Template.singleQuoteTemplate.authorName = function(){
  quote = Quotes.findOne({_id: Session.get('lastQuote')});
  return Meteor.users.findOne({'profile.quotes': Session.get('lastQuote')}).services.twitter.screenName;
}

Template.singleQuoteTemplate.rendered = function(){
  window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return}js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}})}(document,"script","twitter-wjs"));
};

Template.quoteControls.events({
  'click #submitQuote': function(){
    submitQuoteButton = Ladda.create(document.querySelector('#submitQuote'));
    submitQuoteButton.start();
    addToUser = Meteor.users.findOne({'services.twitter.screenName': $('#userEntry').val()});
    Meteor.call("addQuote", $('#quoteEntry').val(), addToUser._id, function(err, data){
      submitQuoteButton.stop();
      $('#submitQuote').addClass('animated bounceOutUp');
      $('#quoteEntry').addClass('animated fadeOut');
      $('#userEntry').addClass('animated fadeOut');
      $('#submitQuote').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){ 
        Session.set('lastQuote', data);
        Router.go('/quotes/' + Session.get('lastQuote'));
      });
    });
    return;
  }
});

Template.homeScreen.helpers({
  render: function(){
    if (Meteor.user().services){
     
    }
  }
});

flash = function(message, color){
  Session.set("flashMessage", message);
  $('#quoteAddedModal').trigger('openModal');
  $('#quoteAddedModal').addClass('animated fadeIn');
};
