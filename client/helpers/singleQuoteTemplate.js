Template.singleQuoteTemplate.quote = function(){
  return Quotes.findOne({_id: Session.get('lastQuote')});
};

Template.singleQuoteTemplate.time = function(){
  return moment.unix(Quotes.findOne({_id: Session.get('lastQuote')}).timestamp).format('dddd, MMMM Do');
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

Template.singleQuoteTemplate.events({
  'click #goToHomeButton': function(){
    Router.go('/');
  }
});
