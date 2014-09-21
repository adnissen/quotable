Router.map(function(){
  this.route('home', {path: '/'});
  this.route('singleQuoteTemplate', {
    path: '/quotes/:_id',
    data: function(){ 
      return Session.set('lastQuote', this.params._id);
    },
    action: function(){
      Blaze.remove(currentScreen);
      currentScreen = Blaze.render(Template.singleQuoteTemplate, document.getElementById('content'));
    }
  });
});
