Router.map(function(){
  this.route('home', {
    path: '/',
    action: function(){
      if (Meteor.user() || Meteor.loggingIn()){
        console.log('we have a user');
        //add snapper
        snapper = new Snap({
          element: document.getElementById('content'),
          touchToDrag: false
        });
        snapper.on('expandLeft', function(){
          $('.snap-drawer-right').hide();
          $('.snap-drawer-left').show();
        });
        snapper.on('expandRight', function(){
          $('.snap-drawer-left').hide();
          $('.snap-drawer-right').show();
        });
        window.onscroll = function () {
          if (snapper.state().state == 'left' && scrollX >= 50)
            snapper.close();
        }
        if (Meteor.isCordova){
          if (device.platform == 'Android') var apiKey = "935dd074afdbe63752a617d98e9de9694f0b8fde";
          else if (device.platform == 'iOS') var apiKey = "ba077e6d6aa0bda8cdb039e7a5d46b06ed4648a2";
        }
        else
          var apiKey = "00ec7acf906494ef63850c802536a29c4c4f042f";
        $('rewards').empty();
        sessionmWidget = null;
        sessionmWidget = new sessionm.widget({
          appID: apiKey,
          style: "box"
        });
        //sessionmWidget.embed('rewards');
        Meteor.subscribe("quotes");
        Meteor.call("getUnreadTotal");
        $('body').mousedown(function(){
          if (snapper.state().state=="right"){
            sessionmWidget.sendAction('view_recent', function(action, earned, achievement){
              console.log(action + " recorded"); // Outputs read_article recorded
            });
            Meteor.call('clearUnread');
          }
        });
        $('body').bind( "touchend", function(e){
          if (snapper.state().state=="right"){
            sessionmWidget.sendAction('view_recent', function(action, earned, achievement){
              console.log(action + " recorded"); // Outputs read_article recorded
            });
            Meteor.call('clearUnread');
          }
        });
        console.log("going to start rendering");
        if (currentScreen)
          Blaze.remove(currentScreen);
        currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
      } else{
        if (currentScreen)
          Blaze.remove(currentScreen);
        if (Meteor.user())
          currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
        else
          currentScreen = Blaze.render(Template.customLogin, document.getElementById('content'));
      }
    }
  });
  this.route('singleQuoteTemplate', {
    path: '/quotes/:_id',
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
      Session.set('lastQuote', this.params._id);
      console.log(Session.get('lastQuote'));
      Meteor.subscribe("quotes", Session.get('lastQuote'));
      Meteor.subscribe("userData", this.params._id);
      currentScreen = Blaze.render(Template.singleQuoteTemplate, document.getElementById('content'));
    }
  });
});
