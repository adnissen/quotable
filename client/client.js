Quotes = new Mongo.Collection("quotes");
Meteor.subscribe("userData");
Meteor.subscribe("quotes");
Meteor.startup(function(){
  currentScreen = null;
  Session.setDefault('activeQuoteMenu', false);
  keen = new Keen({
    projectId: "544d3c4b33e4061c5abc08e6",
    writeKey: "14a762921ab94586bab85314143c1c451cd28a1e15f258d31bfa314f0fb288cbe9768dc965788636e108588d0d5015d590acd1183ed388724c6194acda94f562c94b6b3cce61a22a08a4c162469d39aa9563e26e17f8aa212717118de17442f207b1227af151f17a1459a1ded8a9e912"
  });
});
