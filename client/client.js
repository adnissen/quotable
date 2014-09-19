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
    Blaze.render(Template.homeScreen, document.getElementById('content'));
  }
  else{
    Blaze.render(Template.loginButtons, document.getElementById('content'));
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
};

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

  'click #submitQuote': function(){
    if (Session.get('activeQuoteMenu') === true){
      submitQuoteButton = Ladda.create(document.querySelector('#submitQuote'));
      console.log(submitQuoteButton);
      submitQuoteButton.start();
      addToUser = Meteor.users.findOne({'services.twitter.screenName': $('#userEntry').val()});
      Meteor.call("addQuote", $('#quoteEntryr').val(), addToUser._id);
      if (submitQuoteButton.isLoading() === false){
        $('#submitQuote').addClass('animated bounceOutUp');
        $('#quoteEntry').addClass('animated fadeOut');
        $('#submitQuote').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){ 
          Blaze.remove(quoteView);
        });
        Session.set('activeQuoteMenu', false);
      }
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

Template.homeScreen.helpers({
  render: function(){
    if (Meteor.user().services){
     
    }
  }
});

Template.modalView.flashMessage = function(){
  return Session.get("flashMessage");
}

flash = function(message, color){
  Session.set("flashMessage", message);
  $('#quoteAddedModal').trigger('openModal');
  $('#quoteAddedModal').addClass('animated fadeIn');
};
