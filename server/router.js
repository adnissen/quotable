Router.route('/api/quotes/:user', function () {
    var ret = {};
    ret.quotes = [];
    var user = Meteor.users.findOne({username: this.params.user});
    var quotes = Quotes.find({addedTo: user._id});
    quotes.forEach(function(q){
      ret.quotes.push(q.text);
    });
    this.response.end(JSON.stringify(ret));
}, {where: 'server'});
