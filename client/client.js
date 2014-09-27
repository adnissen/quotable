Quotes = new Mongo.Collection("quotes");
Meteor.subscribe("userData");
Meteor.subscribe("quotes");
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
Meteor.startup(function(){
  currentScreen = null;
  Session.setDefault('activeQuoteMenu', false);
});

Template.viewQuotesTemplate.authorQuote = function(){
  if (!Meteor.user())
    return;
  return Quotes.find({addedTo: Session.get('author')}, {sort: {timestamp: -1}});
};

Template.viewQuotesTemplate.author = function(){
  if (this.addedBy === this.addedTo)
    return "overheard by " + Meteor.users.findOne({_id: this.addedTo}).username;
  return Meteor.users.findOne({_id: this.addedTo}).username;
};

Template.headerView.unread = function(){
  if (Meteor.user())
    return Meteor.user().profile.unread;
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

Template.sidebar.events({ 
  'click #submitFriend': function(){
    Meteor.call("sendFriendRequest", $('#addFriendField').val());
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
    Session.set('author', this.addedTo);
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

Template.sidebar.author = function(){
  if (Meteor.users.findOne({_id: this.addedTo})._id == this.addedBy){
    return "overheard by " + Meteor.users.findOne({_id: this.addedTo}).username;
  }
  else
    return Meteor.users.findOne({_id: this.addedTo}).username;
}

Template.quoteControls.thisUser = function(){
  if (Meteor.user() && Meteor.user().services){
    return Meteor.user().username;
  }
}

Template.quoteControls.rendered = function(){
  $('#quoteEntry').show();
  $('#userEntry').addClass('animated fadeIn');
  $('#quoteEntry').addClass('animated fadeIn');
  $('#submitQuote').addClass('animated bounceInDown');
  $('#userEntry').addClass('animated fadeIn');
};

Template.customLogin.events({
  'click #customLoginSignin': function(){
    if ($('#customLoginUsername').val().length != 0 && $('#customLoginPassword').val().length != 0){
      Meteor.loginWithPassword($('#customLoginUsername').val(), $('#customLoginPassword').val(), function(err){
        if (Meteor.user()){
          Blaze.remove(currentScreen);
          currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
        }
      });
    }
  },

  'click #customLoginCreate': function(){
    if ($('#customLoginUsername').val().length != 0 && $('#customLoginPassword').val().length != 0){
      Accounts.createUser({username: $('#customLoginUsername').val(), password: $('#customLoginPassword').val()}, function(err){
        if (err)
        return;
      Meteor.loginWithPassword($('#customLoginUsername').val(), $('#customLoginPassword').val(), function(err){
        if (Meteor.user()){
          Blaze.remove(currentScreen);
          currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
        }
      });
      });
    }
  }
});

Template.homeScreen.events({
  'click #menuQuote': function() {
    if (Session.get('activeQuoteMenu') === true){
      Blaze.remove(quoteView);
      Session.set('activeQuoteMenu', false);
      return;
    }
    else{
      quoteView = Blaze.render(Template.quoteControls, document.getElementById('menuQuoteDiv'));
      Session.set('activeQuoteMenu', true);
      return;
    }
  }
});

Template.viewQuotesTemplate.events({
  'click #goToHomeButton': function(){
    Router.go('/');
  }
});

Template.singleQuoteTemplate.events({
  'click #goToHomeButton': function(){
    Router.go('/');
  }
});

Template.singleQuoteTemplate.quote = function(){
  return Quotes.findOne({_id: Session.get('lastQuote')});
};

Template.singleQuoteTemplate.authorName = function(){
  return Meteor.users.findOne({'profile.quotes': Session.get('lastQuote')}).username;
}

Template.singleQuoteTemplate.overheard = function(){
  return (Meteor.users.findOne({'profile.quotes': Session.get('lastQuote')})._id == Quotes.findOne({_id: Session.get('lastQuote')}).addedBy);

}

Template.singleQuoteTemplate.authorPic = function(){
  return Meteor.users.findOne({'profile.quotes': Session.get('lastQuote')}).services.twitter.profile_image_url_https;
}

Template.singleQuoteTemplate.rendered = function(){
  window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return}js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}})}(document,"script","twitter-wjs"));
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
      submitQuoteButton.stop();
      $('#submitQuote').addClass('animated bounceOutUp');
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

Template.homeScreen.helpers({
  render: function(){
    if (Meteor.user().services){
     
    }
  }
});

flash = function(message, color){
  Session.set("flashMessage", message);
  $('#quoteAddedModal').trigger('openModal');
  $('#quoteAddedModal').addClass('animated fadeIn');
};
