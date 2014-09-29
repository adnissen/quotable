Template.viewQuotesTemplate.authorQuote = function(){
  if (!Meteor.user())
    return;
  return Quotes.find({addedTo: Session.get('author')}, {sort: {timestamp: -1}});
};

Template.viewQuotesTemplate.author = function(){
  if (this.addedBy === this.addedTo)
    return "overheard by " + Meteor.users.findOne({_id: this.addedTo}).username;
  return Meteor.users.findOne({_id: this.addedTo}).username;
};

Template.viewQuotesTemplate.events({
  'click #goToHomeButton': function(){
    if (currentScreen)
      Blaze.remove(currentScreen);
    currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
  }
});
