Quotes = new Mongo.Collection("quotes");
Meteor.subscribe("userData");
Meteor.subscribe("quotes");
Meteor.startup(function(){
  currentScreen = null;
  Session.setDefault('activeQuoteMenu', false);
});
