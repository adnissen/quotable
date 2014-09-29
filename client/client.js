Quotes = new Mongo.Collection("quotes");
Meteor.subscribe("userData");
Meteor.subscribe("quotes");
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
Meteor.startup(function(){
  currentScreen = null;
  Session.setDefault('activeQuoteMenu', false);
});
