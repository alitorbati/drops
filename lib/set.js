Songs = new Mongo.Collection("songs");

Meteor.methods({
  
  addSong: function (track, subthread, source) {

    Songs.insert(track);

  },

  deleteSong: function (songId) {
    Songs.remove(songId);
  },

  removeAllSongs: function() {
    return Songs.remove({});
  }

});

if (Meteor.isClient) {
  Meteor.subscribe("songs");
}

if (Meteor.isServer) {
  Meteor.publish("songs", function () {
    return Songs.find();
  });
}