Template.sidebar.helpers({
  recentQuote: function(){
    return Quotes.find({}, {sort: {timestamp: -1}, limit: 5});
  },
  topQuote: function(){
    return Quotes.find({}, {sort: {likes: -1}, limit: 5});
  },
  friend: function(){
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.friends)
      return Meteor.users.find({_id: {$in: Meteor.user().profile.friends}});
  },
  pending: function(){
   if (Meteor.user() && Meteor.user().profile)
    return Meteor.users.find({_id:{$in: Meteor.user().profile.friendRequests}});
  },
  author: function(){
    if (Meteor.users.findOne({_id: this.addedTo})._id == this.addedBy){
      return "overheard by " + Meteor.users.findOne({_id: this.addedTo}).username;
    }
    else
  return Meteor.users.findOne({_id: this.addedTo}).username;
  },
  time: function(){
    return moment(this.timestamp).format('dddd, MMMM Do');
  },
  liked: function(){
    return (Meteor.user().profile.liked.indexOf(this._id) != -1)
  }
});

Template.sidebar.events({
  'click #myQuotes': function(){
    snapper.close();
    Session.set('author', Meteor.userId());
    Router.go('/' + Meteor.user().username);
  },
  'click #submitFriend': function(){
    Meteor.call("sendFriendRequest", $('#addFriendField').val().toLowerCase(), function(err, data){});
    swal('You just added a friend!', "Once they accept your request, you'll be able to see each other's quotes and attribute quotes to them.", "success");
    keen.addEvent('addFriend', {username: $('#addFriendField').val().toLowerCase(), addedBy: Meteor.user().username, timestamp: new Date().toISOString()});
    $('#addFriendField').val('');
  },
  'click #inviteFriend':function(){
    if ($('#inviteFriendField').val() != ''){
      Meteor.call('sendInviteEmail', $('#inviteFriendField').val());
      swal('You just added a friend!', "Once they accept your request, you'll be able to see each other's quotes and attribute quotes to them.", "success");
      keen.addEvent('emailInvite', {email: $('#inviteFriendField').val(), addedBy: Meteor.user().username, timestamp: new Date().toISOString()});
      $('#inviteFriendField').val('');
    }
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
    Router.go('/' + this.username);
  },
  'click #logOut': function(){
    Meteor.logout();
    snapper.close();
    snapper = null;
    if (currentScreen)
      Blaze.remove(currentScreen)
    currentScreen = Blaze.render(Template.customLogin, document.getElementById('content'));
  },
  'click i.fa-thumbs-up': function(event){
    if (Meteor.user().profile.liked == undefined || Meteor.user().profile.liked.indexOf(this._id) != -1){
      Meteor.call('unlikeQuote', this._id);
      event.target.className = 'fa fa-thumbs-o-up fa-lg';
    }
    else{
      Meteor.call('likeQuote', this._id);
      event.target.className = 'fa fa-thumbs-up fa-lg';
    }
  },
  'click i.fa-thumbs-o-up': function(event){
    if (Meteor.user().profile.liked == undefined || Meteor.user().profile.liked.indexOf(this._id) != -1){
      Meteor.call('unlikeQuote', this._id);
      event.target.className = 'fa fa-thumbs-o-up fa-lg';
    }
    else{
      Meteor.call('likeQuote', this._id);
      event.target.className = 'fa fa-thumbs-up fa-lg';
    }
  },
  'click i.fa-edit': function(){
    Router.go('/');
    snapper.close();
    $('#quoteEntry').focus();
  },
  'click i.fa-close': function(){
    snapper.close();
  }
});
