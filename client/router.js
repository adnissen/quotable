Router.map(function(){
  this.route('home', {
    path: '/',
    action: function(){
      if (Meteor.user()){
        //add snapper
        snapper = new Snap({
          element: document.getElementById('content')
        });
        Meteor.subscribe("quotes");
        Meteor.call("getUnreadTotal");
        $('body').mousedown(function(){
          if (snapper.state().state=="right")
            Meteor.call('clearUnread');
        });
        $('body').bind( "touchend", function(e){
          if (snapper.state().state=="right")
            Meteor.call('clearUnread');
        });
        if (currentScreen)
          Blaze.remove(currentScreen);
        currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
      }
      else{
        if (currentScreen)
          Blaze.remove(currentScreen);
        currentScreen = Blaze.render(Template.customLogin, document.getElementById('content'));
      }
    }
  });
  this.route('singleQuoteTemplate', {
    path: '/quotes/:_id',
    data: function(){
      return Session.set('lastQuote', this.params._id);
    },
    action: function(){
      if (Meteor.user()){
        if (!snapper){
          snapper = new Snap({
            element: document.getElementById('content')
          });
        }

        $('body').mousedown(function(){
          if (snapper.state().state=="right")
          Meteor.call('clearUnread');
        });
        $('body').bind( "touchend", function(e){
          if (snapper.state().state=="right")
          Meteor.call('clearUnread');
        });
      }
      if (currentScreen)
        Blaze.remove(currentScreen);
      Meteor.subscribe("quotes");
      currentScreen = Blaze.render(Template.singleQuoteTemplate, document.getElementById('content'));
    },
    waitOn: function(){
      return Meteor.subscribe('quotes');
    }
  });
});
