Router.map(function(){
  this.route('', {path: '/'});
  this.route('singleQuoteTemplate', {
    path: '/quotes/:_id',
    data: function(){ 
      Blaze.remove(currentScreen);
      currentScreen = Blaze.render(Template.singleQuoteTemplate, document.getElementById('content'));
      return Session.set('lastQuote', this.params._id);
  }});
});
