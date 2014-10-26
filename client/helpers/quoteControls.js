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
    swal("Hello!", "Welcome to quotable! Tap the icon on the right to see recent quotes, but there won't be any because you don't have any friends! Tap the icon on the left to add or invite friends. Until you do, only your own quotes will show up under Recent Quotes. Start quoting the world around you!");
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
      if (Meteor.userId() != addToUser._id){
        sessionmWidget.sendAction('quote', function(action, earned, achievement){
          console.log(action + " recorded"); // Outputs read_article recorded
        });
      }
      else{
        sessionmWidget.sendAction('quote_overheard', function(action, earned, achievement){
          console.log(action + " recorded"); // Outputs read_article recorded
        });
      }
      submitQuoteButton.stop();
      swal("Nice!", "Quote Added!", "success")
      /*$('#quoteEntry').addClass('animated fadeOut');
      $('#userEntry').addClass('animated fadeOut');
      $('#submitQuote').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        Session.set('lastQuote', data);
        Router.go('/quotes/' + Session.get('lastQuote'));
      });*/
    });
    return;
  }
});
