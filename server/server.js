Meteor.startup(function () {
  // code to run on server at startup
});

Accounts.onCreateUser(function(options, user){
  if (options.profile)
    user.profile = options.profile;

  user.profile.friends = new Array();
  user.profile.friendsRequested = new Array();
  user.profile.friendRequests = new Array();
  user.profile.blocked = new Array();
  user.profile.quotes = new Array();
  user.profile.addedQuotes = new Array();

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

Meteor.publish("userData", function(){
  if (this.userId)
    return Meteor.users.find({$or: [{_id: this.userId}, {'profile.friends': this.userId}]}, {fields: {_id: 1, 'services': 1, 'username': 1}});
});

Meteor.publish("quotes", function(){
  if (this.userId){
    user = Meteor.users.findOne({_id: this.userId});
    return Quotes.find({$or: [{addedTo: this.userId}, {addedTo: {$in: user.profile.friends}}]});
  }
});


Meteor.methods({
  addQuote: function(_text, _addedTo){
    if (!this.userId)
      return "not logged in";
    //set _timestamp to the current time
    _timestamp = Date.now();
    thisUser = Meteor.users.findOne({_id: this.userId});
    if (thisUser.profile.friends.indexOf(_addedTo) === -1)
      return "you're not friends with this person";
    _addedBy = this.userId;
    console.log(_text);
    addedQuote = Quotes.insert({text: _text, timestamp: _timestamp, addedBy: _addedBy, addedTo: _addedTo, timestamp: _timestamp});
    Meteor.users.update({_id: _addedTo}, {$addToSet: {'profile.quotes': addedQuote}});
    Meteor.users.update({_id: this.userId}, {$addToSet: {'profile.addedQuotes': addedQuote}});
    return addedQuote;
  },
  sendFriendRequest: function(_username){
    if (!this.userId)
      return;
    _user = Meteor.users.findOne({'services.twitter.screenName': _username});
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
