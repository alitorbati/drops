Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'appBody',
});

Router.route('home', {
  path: '/',
  waitOn: function() {
    SC.whenStreamingReady(function() {
    	return
    });
  },    
});

Router.route('about', {
  path: '/about', 
});

Router.route('/songs/:_id', function () {
  
  var song = Songs.findOne({_id: this.params._id});
  Session.set("commentSong", song);

  console.log(song);

  this.render('home');
  // this.render('modal', {to: 'modal'});

});