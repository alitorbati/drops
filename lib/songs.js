Songs = new Mongo.Collection("songs");

Meteor.methods({
	
	addSong: function (track, subthread, source) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      console.log('errorororo');
    	throw new Meteor.Error("not-authorized");
    }

    Songs.insert({
    	track: track,
    	owner: Meteor.userId(),
    	createdAt: new Date(),
    	subthread: subthread,
    	source: source 
    }, function(id) {
    	console.log(id);
    });

  },

  deleteSong: function (songId) {
  	if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    
    Songs.remove(songId);
  },

});

if (Meteor.isClient) {
  Meteor.subscribe("songs");
}

if (Meteor.isServer) {
  Meteor.publish("songs", function () {
    return Songs.find();
  });
}