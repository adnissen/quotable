Template.welcomeScreen.rendered = function(){
  $('#inviteFriend').hide();
  $('.topcoat-navigation-bar').hide();
  $('.content').css('top', 0);
}

Template.welcomeScreen.events({
  'click button': function(){
    $('.topcoat-navigation-bar').show();
    $('.content').css('top', 70);
    if (currentScreen)
      Blaze.remove(currentScreen);
    currentScreen = Blaze.render(Template.customSignup, document.getElementById('content'));
  },
  'click .welcomeScreenSignIn': function(){
    $('.topcoat-navigation-bar').show();
    $('.content').css('top', 70);
    if (currentScreen)
      Blaze.remove(currentScreen);
    currentScreen = Blaze.render(Template.customLogin, document.getElementById('content'));
  }
})
