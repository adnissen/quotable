Template.quoteControls.thisUser = function(){
  if (Meteor.user() && Meteor.user().services){
    return Meteor.user().username;
  }
}

Template.quoteControls.rendered = function(){
  $('#quoteEntry').show();
  $('#userEntry').addClass('animated fadeIn');
  $('#quoteEntry').addClass('animated fadeIn');
  $('#userEntry').addClass('animated fadeIn');
};

Template.quoteControls.friends = function(){
  if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.friends){
    return Meteor.users.find({_id: {$in: Meteor.user().profile.friends}});
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
      $('#quoteEntry').addClass('animated fadeOut');
      $('#userEntry').addClass('animated fadeOut');
      $('#submitQuote').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        Session.set('lastQuote', data);
        Router.go('/quotes/' + Session.get('lastQuote'));
      });
    });
    return;
  }
});
