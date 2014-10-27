Template.quoteControls.helpers({
  thisUser: function(){
    if (Meteor.user() && Meteor.user().services){
      return Meteor.user().username;
    }
  },
  friends: function(){
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.friends){
      return Meteor.users.find({_id: {$in: Meteor.user().profile.friends}});
    }
  }
});
Template.quoteControls.rendered = function(){
  $('#quoteEntry').show();
  if (Meteor.user().profile.friends.length <= 0 && (Meteor.user().profile.seenWelcome == false || Meteor.user().profile.seenWelcome == undefined)){
    swal("Hello!", "Welcome to quotable! Tap the icon on the right to see recent quotes, but there won't be any because you don't have any friends! Tap the icon on the left to add or invite friends. Until then, we've added a couple popular quotes to the menu on the right. Start quoting the world around you!");
    Meteor.call('seenWelcome');
  }
};

Template.quoteControls.events({
  'click #submitQuote': function(){
    submitQuoteButton = Ladda.create(document.querySelector('#submitQuote'));
    submitQuoteButton.start();
    val = $('#userDropdown').val();
    if (val === "" || $('#quoteEntry').val() === ""){
      submitQuoteButton.stop();
      return;
    }
    addToUser = Meteor.users.findOne({'username': val});
    Meteor.call("addQuote", $('#quoteEntry').val(), addToUser._id, function(err, data){
      keen.addEvent('addQuote', {username: Meteor.user().username, quote: $('#quoteEntry').val(), addedTo: addToUser.username, timestamp: new Date().toISOString()});
      submitQuoteButton.stop();
      swal("Nice!", "Quote Added!", "success");
    });
    return;
  }
});
