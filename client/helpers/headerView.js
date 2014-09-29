Template.headerView.unread = function(){
  if (Meteor.user())
    return Meteor.user().profile.unread;
};

Template.headerView.pendingFriends = function(){
  if (Meteor.user())
    return Meteor.user().profile.friendRequests.length;
};

Template.headerView.events({
  'click .fa-comment': function(){
    if (snapper.state().state=="right" || snapper.state().state == "left" ){
      snapper.close();
    } else {
      snapper.open('right');
      Meteor.call('clearUnread');
    }
  },

  'click .fa-bars': function(){
    if (snapper.state().state == 'right' || snapper.state().state =='left'){
      snapper.close();
    } else {
      snapper.open('left');
    }
  }
});
