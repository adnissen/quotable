Template.singleQuoteTemplate.helpers({
  quote: function(){
    return Quotes.findOne({_id: Session.get('lastQuote')});
  },
  liked: function(){
    return (Meteor.user().profile.liked.indexOf(Session.get('lastQuote')) != -1)
  },
  time: function(){
    return moment(Quotes.findOne({_id: Session.get('lastQuote')}).timestamp).format('dddd, MMMM Do');
  },
  authorName:function(){
    return Meteor.users.findOne({'profile.quotes': Session.get('lastQuote')}).username;
  },
  overheard: function(){
    return (Meteor.users.findOne({'profile.quotes': Session.get('lastQuote')})._id == Quotes.findOne({_id: Session.get('lastQuote')}).addedBy);
  },
  authorPic: function(){
    return Meteor.users.findOne({'profile.quotes': Session.get('lastQuote')}).services.twitter.profile_image_url_https;
  }
})

Template.singleQuoteTemplate.rendered = function(){
  window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return}js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}})}(document,"script","twitter-wjs"));
};

Template.singleQuoteTemplate.events({
  'click #goToHomeButton': function(){
    Router.go('/');
  },
  'click i': function(event){
    if (Meteor.user().profile.liked == undefined || Meteor.user().profile.liked.indexOf(Session.get('lastQuote')) != -1){
      Meteor.call('unlikeQuote', Session.get('lastQuote'));
      event.target.className = 'fa fa-thumbs-o-up fa-lg';
    }
    else{
      Meteor.call('likeQuote', Session.get('lastQuote'));
      event.target.className = 'fa fa-thumbs-up fa-lg';
    }
  }
});
