Template.headerView.unread = function(){
  if (Meteor.user())
    return Meteor.user().profile.unread;
};

Template.headerView.pendingFriends = function(){
  if (Meteor.user())
    return Meteor.user().profile.friendRequests.length;
};

Template.headerView.events({
  'click .topcoat-navigation-bar__item.right': function(){
    if (snapper.state().state=="right" || snapper.state().state == "left" ){
      snapper.close();
    } else {
      snapper.open('right');
      $('.snap-drawer-right').show();
      $('.snap-drawer-left').hide();
      Meteor.call('clearUnread');
    }
  },

  'click .topcoat-navigation-bar__item.left': function(){
    if (snapper.state().state == 'right' || snapper.state().state =='left'){
      snapper.close();
    } else {
      snapper.open('left');
      $('.snap-drawer-left').show();
      $('.snap-drawer-right').hide();
    }
  }
});
