Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'appBody',
});

Router.route('home', {
  name: 'home',
  path: '/',
  data: function(){
        return {
            song: this.params.query.song,
        };
    },
  waitOn: function() {
    SC.whenStreamingReady(function() {
    	return
    });
  },    
});