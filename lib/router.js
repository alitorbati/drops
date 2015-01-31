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