Template.viewQuotesTemplate.helpers({
  authorQuote: function(){
    return Quotes.find({addedTo: Session.get('author')}, {sort: {timestamp: -1}});
  },
  isOwner: function(){
    if (Meteor.user())
      return (Meteor.user()._id === Session.get('author'));
    else
      return false;
  },
  author: function(){
    if (this.addedBy === this.addedTo)
      return "overheard by " + Meteor.users.findOne({_id: this.addedTo}).username;
    return Meteor.users.findOne({_id: this.addedTo}).username;
  },
  isFriend: function(){
    if (Meteor.user() == null)
      return false;
    if (Meteor.user().profile.friends.indexOf(Session.get('author')) != -1)
      return true;
    else
      return false;
  },
  backText: function(){
    if (Meteor.user() == null)
      return 'Sign Up';
    else
      return 'Back';
  }
});

Template.viewQuotesTemplate.rendered = function(){
  Meteor.subscribe("quotes", null, Session.get('author'));
};

Template.viewQuotesTemplate.events({
  'click #goToHomeButtonViewQuotes': function(){
    if (Meteor.user() == null){
      if (currentScreen)
        Blaze.remove(currentScreen);
      currentScreen = Blaze.render(Template.welcomeScreen, document.getElementById('content'));
      return;
    }
    Router.go('/');
  },

  'click #removeFriendButton': function(){
    Meteor.call("removeFriend", Session.get('author'));
    Meteor.subscribe('quotes');
    if (currentScreen)
      Blaze.remove(currentScreen);
    currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
  },

  'click .fa-trash': function(){
    Meteor.call('removeQuote', this._id);
  }
});
