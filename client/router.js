Router.map(function(){
  this.route('home', {
    path: '/',
    action: function(){
      if (Meteor.user()){
        //add snapper
        snapper = new Snap({
          element: document.getElementById('content')
        });
        window.onscroll = function () {
          if (snapper.state().state == 'left' && scrollX >= 50)
            snapper.close();
        }
        $('#rewards').empty();
        sessionmWidget = null;
        sessionmWidget = new sessionm.widget({
          appID: "00ec7acf906494ef63850c802536a29c4c4f042f",
          style: "box"
        });
        sessionmWidget.embed('rewards');
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
      Meteor.subscribe("quotes", this.params._id);
      console.log(this.params._id);
      currentScreen = Blaze.render(Template.singleQuoteTemplate, document.getElementById('content'));
    },
    waitOn: function(){
      return Meteor.subscribe('quotes', this.params._id);
    }
  });
});
