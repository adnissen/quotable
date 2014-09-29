Template.sidebar.recentQuote = function(){
  return Quotes.find({}, {sort: {timestamp: -1}, limit: 20});
}

Template.sidebar.friend = function(){
  if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.friends)
    return Meteor.users.find({_id: {$in: Meteor.user().profile.friends}});
}

Template.sidebar.pending = function(){
  if (Meteor.user() && Meteor.user().profile)
    return Meteor.users.find({_id:{$in: Meteor.user().profile.friendRequests}});
}

Template.sidebar.author = function(){
  if (Meteor.users.findOne({_id: this.addedTo})._id == this.addedBy){
    return "overheard by " + Meteor.users.findOne({_id: this.addedTo}).username;
  }
  else
    return Meteor.users.findOne({_id: this.addedTo}).username;
}

Template.sidebar.time = function(){
  return moment.unix(this.timestamp).format('dddd, MMMM Do');
}

Template.sidebar.events({
  'click #submitFriend': function(){
    Meteor.call("sendFriendRequest", $('#addFriendField').val().toLowerCase(), function(err, data){
      sessionmWidget.sendAction('add_friend', function(action, earned, achievement){
        console.log(action + " recorded"); // Outputs read_article recorded
      });
    });
    $('#addFriendField').val('');
  },
  'click #pendingFriend': function(){
    Meteor.subscribe("userData");
    Meteor.call("acceptFriendRequest", this._id);
  },
  'click #quote': function(){
    snapper.close();
    Router.go('/quotes/' + this._id);
  },
  'click #quoteAuthor': function(){
    snapper.close();
    if (this.addedTo)
      Session.set('author', this.addedTo);
    else if (this._id)
      Session.set('author', this._id);
    if (currentScreen)
      Blaze.remove(currentScreen);
    currentScreen = Blaze.render(Template.viewQuotesTemplate, document.getElementById('content'));
  },
  'click #logOut': function(){
    Meteor.logout();
    snapper.close();
    snapper = null;
  }
});
