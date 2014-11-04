Template.admin.helpers({
  numUsers: function(){
    Meteor.call('adminGetNumUsers', function(e, d){
      Session.set('numUsers', d.count);
    });
    return Session.get('numUsers');
  },
  numQuotes: function(){
    Meteor.call('adminGetNumQuotes', function(e, d){
      Session.set('numQuotes', d.count);
    });
    return Session.get('numQuotes');
  },
  users: function(){
    Meteor.call('adminGetAllUsers', function(e, d){
      Session.set('allUsers', d.users);
    });
    return Session.get('allUsers');
  }
});
