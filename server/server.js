Meteor.startup(function () {
  // code to run on server at startup
});

Accounts.onCreateUser(function(options, user){
  if (options.profile)
    user.profile = options.profile;
  else
    user.profile = {};
  user.username = user.username.toLowerCase();
  user.profile.friends = new Array();
  user.profile.friendsRequested = new Array();
  user.profile.friendRequests = new Array();
  user.profile.blocked = new Array();
  user.profile.quotes = new Array();
  user.profile.addedQuotes = new Array();
  user.profile.seenWelcome = false;

  return user;
});

/*
 * Quote:
 *
 * text:string
 * timestamp:int
 * addedBy:string
 * addedTo:string
 */

Quotes = new Mongo.Collection('quotes');
Quotes.allow({
  insert: function(){
    return false;
  },
  update: function(){
   return false;
  },
  remove: function(){
    return false;
  }
});

Meteor.users.allow({
  insert: function(){
    return false;
  },
  update: function(){
   return false;
  },
  remove: function(){
    return false;
  }
});

//we need to store email addresses so that you can't spam multiple emails
Emails = new Mongo.Collection('emails');

Meteor.publish("userData", function(id){
  check(id, Match.Any);
  /*
  if (this.userId){
    if (id != undefined){
      quote = Quotes.findOne({_id: id});
      return Meteor.users.find({$or: [{_id: this.userId}, {'profile.friends': this.userId}, {'profile.friendRequests' : this.userId}, {_id: quote.addedTo}]}, {fields: {_id: 1, 'profile': 1, 'services': 1, 'username': 1}});
    }
    else{
      return Meteor.users.find({$or: [{_id: this.userId}, {'profile.friends': this.userId}, {'profile.friendRequests' : this.userId}]}, {fields: {_id: 1, 'profile': 1, 'services': 1, 'username': 1}});
    }
  }
  else{
    quote = Quotes.findOne({_id: id});
    return Meteor.users.find({_id: quote.addedTo});
  }*/
  return Meteor.users.find();
});

Meteor.publish("quotes", function(id){
  //bad practice, but a bunch of subs don't need the id param so we need to do it this way
  check(id, Match.Any);
  if (this.userId){
    user = Meteor.users.findOne({_id: this.userId});
    return Quotes.find({$or: [{addedTo: this.userId}, {addedTo: {$in: user.profile.friends}}, {_id: id}]});
  }
  else{
    return Quotes.find({_id: id});
  }
});


Meteor.methods({
  seenWelcome: function(){
    Meteor.users.update({_id: this.userId}, {$set: {'profile.seenWelcome': true}});
  },
  sendInviteEmail: function(email){
    if (!this.userId)
      return;
    check(email, String);
    this.unblock();

    var thisUser = Meteor.users.findOne({_id: this.userId});
    var to = email;
    var from = 'invites@quotable.meteor.com';
    var subject = "You've been invited to quotable!";
    var text = "Hi! You've been invited by " + thisUser.username + " to try out quotable, an app that lets you remember and share funny things you and your friends say or overhear.\n\nTo get started, all you need to do is visit http://quotable.meteor.com>quotable.meteor.com and sign up! It's totally free, and we won't ever ask for any more personal information than a username and email. To add your friend, simply open the left menu and add " + thisUser.username + " as a friend. That's it!\n\n\nWe hope you enjoy your time with quotable!\n-The quotable Team.";
    Email.send({to:to, from:from, subject:subject, text:text});
  },
  getQuotesTotal: function(){
    return Quotes.find().count() + 2000;
  },
  getUnreadTotal: function(){
    if (!this.userId)
      return "not logged in";
    thisUser = Meteor.users.findOne({_id: this.userId});
    if (!thisUser.profile.unread)
       Meteor.users.update({_id: this.userId}, {$set: {'profile.unread': 0}});
    return thisUser.profile.unread;
  },
  clearUnread: function(){
    if (!this.userId)
      return "not logged in";
    thisUser = Meteor.users.findOne({_id: this.userId});
    if (!thisUser.profile.unread)
      Meteor.users.update({_id: this.userId}, {$set: {'profile.unread': 0}});
    Meteor.users.update({_id: this.userId}, {$set: {'profile.unread': 0}});
    return 0;
  },
  addQuote: function(_text, _addedTo){
    if (!this.userId)
      return "not logged in";
    //set _timestamp to the current time
    _timestamp = Date.now();
    thisUser = Meteor.users.findOne({_id: this.userId});
    if (thisUser.profile.friends.indexOf(_addedTo) === -1 && thisUser._id != _addedTo)
      return "you're not friends with this person";
    _addedBy = this.userId;
    addedQuote = Quotes.insert({text: _text, timestamp: _timestamp, addedBy: _addedBy, addedTo: _addedTo, timestamp: _timestamp});
    Meteor.users.update({_id: _addedTo}, {$addToSet: {'profile.quotes': addedQuote}});
    Meteor.users.update({_id: this.userId}, {$addToSet: {'profile.addedQuotes': addedQuote}});
    
    //increment unread
    Meteor.users.update({_id: {$in: thisUser.profile.friends}}, {$inc: {'profile.unread': 1}}, {multi: true});
    return addedQuote._id;
  },
  removeFriend: function(friendId){
    if (!this.userId)
      return;
    Meteor.users.update({_id: this.userId}, {$pull: {'profile.friends': friendId}});
    Meteor.users.update({_id: friendId}, {$pull: {'profile.friends': this.userId}});
  },
  removeQuote: function(quoteId){
    if (!this.userId)
      return;
    quote = Quotes.findOne({_id: quoteId});
    if (quote.addedTo == this.userId){
      Quotes.remove({_id: quoteId});
      return;
    }
    else
      return;
  },
  sendFriendRequest: function(_username){
    check(_username, String);
    if (!this.userId)
      return;
    _user = Meteor.users.findOne({'username': _username});
    thisUser = Meteor.users.findOne({_id: this.userId});
    if (!_user)
      return "user does not exist"
    if (thisUser.profile.friendsRequested.indexOf(_user._id) != -1)
      return "already requested this user"
    if (thisUser.profile.friends.indexOf(_user._id) != -1)
      return "you're already friends with this user"

    Meteor.users.update({_id: _user._id}, {$addToSet: {'profile.friendRequests': this.userId}});
    Meteor.users.update({_id: this.userId}, {$addToSet: {'profile.friendsRequested': _user._id}});
  },
  acceptFriendRequest: function(_userId){
    if (!this.userId)
      return;
    _user = Meteor.users.findOne({_id: _userId});
    thisUser = Meteor.users.findOne({_id: this.userId});
    if (!_user)
      return "that user does not exist";
    if (thisUser.profile.friendRequests.indexOf(_userId) == -1)
      return "this user did not request you as a friend";
    if (thisUser.profile.friends.indexOf(_userId) != -1)
      return "you're already friends with this user"

    //add both accounts to eachothers friends lists
    Meteor.users.update({_id: this.userId}, {$addToSet: {'profile.friends': _userId}});
    Meteor.users.update({_id: _userId}, {$addToSet: {'profile.friends': this.userId}});

    //remove the requests
    Meteor.users.update({_id: this.userId}, {$pull: {'profile.friendRequests': _userId}});
    Meteor.users.update({_id: _userId}, {$pull: {'profileFriendsRequested': this.userId}});
  },
  blockUser: function(_username){
    return;
  }
});
