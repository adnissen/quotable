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
      $('.snap-drawer-right').show();
      $('.snap-drawer-left').show();
    } else {
      snapper.open('right');
      $('.snap-drawer-right').show();
      $('.snap-drawer-left').hide();
      Meteor.call('clearUnread');
    }
  },

  'click .fa-bars': function(){
    if (snapper.state().state == 'right' || snapper.state().state =='left'){
      snapper.close();
      $('.snap-drawer-left').show();
      $('.snap-drawer-right').show();
    } else {
      snapper.open('left');
      $('.snap-drawer-left').show();
      $('.snap-drawer-right').hide();
    }
  }
});
