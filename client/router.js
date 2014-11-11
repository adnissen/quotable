Router.map(function(){
  this.route('viewQuotesTemplate', {
    path: '/:author',
    action: function(){
      Session.set('tempAuthor', this.params.author);
      Meteor.subscribe('quotes', null, this.params.author);
      Meteor.subscribe('userData', null, this.params.author, function(){
        var user = Meteor.users.findOne({username: Session.get('tempAuthor')})._id;
        Session.set('author', user);
      });
      if (currentScreen)
        Blaze.remove(currentScreen);
      currentScreen = Blaze.render(Template.viewQuotesTemplate, document.getElementById('content'));
    }
  });
  this.route('newPassword', {
    path: '/reset-password/:token',
    action: function(){
      if (currentScreen)
        Blaze.remove(currentScreen);
      currentScreen = Blaze.render(Template.newPassword, document.getElementById('content'));
      Session.set('token', this.params.token);
    }
  });
  this.route('home', {
    path: '/',
    action: function(){
       console.log("going to start rendering");
        if (currentScreen){
          console.log('1');
          Blaze.remove(currentScreen);
        }
        console.log(Meteor.user());
        console.log(Meteor.loggingIn());
        if (Meteor.user() || Meteor.loggingIn()){
          console.log('2');
          currentScreen = Blaze.render(Template.quoteControls, document.getElementById('content'));
        }
        else{
          console.log('3');
          currentScreen = Blaze.render(Template.welcomeScreen, document.getElementById('content'));
        }
      if (Meteor.user() || Meteor.loggingIn()){
        Meteor.subscribe('userData');
        console.log('we have a user');
        if (!snapper){
          snapper = new Snap({
            element: document.getElementById('container'),
            touchToDrag: false,
            maxPosition: window.innerWidth,
            minPosition: -window.innerWidth
          });
        }
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
        /*
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
        //sessionmWidget.embed('rewards');*/
        Meteor.subscribe("quotes");
        Meteor.call("getUnreadTotal");
        $('body').mousedown(function(){
          Meteor.call('clearUnread');
        });
        $('body').bind( "touchend", function(e){
          if (snapper.state().state=="right"){
            Meteor.call('clearUnread');
          }
        });
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
  this.route('admin', {
    path: '/admin/admin',
    action: function(){
      if (Meteor.userId() == 'uPdEp6wmwASfLdyYL'){
        if (currentScreen)
          Blaze.remove(currentScreen);
        currentScreen = Blaze.render(Template.admin, document.getElementById('content'));
      }
    }
  });
});
