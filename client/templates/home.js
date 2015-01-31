Template.home.events({

    "submit .new-song": function (event) {

        var text = event.target.text.value;
        var track;

        console.log(text);
        
        //SC.get("/tracks/" + text, function(resp){
        SC.get('/resolve/?url=' + text, {limit: 1}, function(resp){
          console.log(resp);
          if (resp.errors) {
            console.log('song does not exist');
          } else {
            track = resp;
            
            getComments(track);

            event.target.text.value = "";
            console.log(track);
          }
        });
        return false;
    },
});

var playSound = function(currentSong) {
  
  soundManager.stopAll();

  console.log(currentSong);

  if (currentSong != undefined) {
    
    var streamUrl = currentSong.stream_url.replace('https://api.soundcloud.com', '');

    SC.stream(streamUrl,{
        onload : function() {
            Session.set("currentSound", {
                id: this.id,
                duration: this.duration
            });

            $('.player-container').removeClass('hidden');

        },
        onfinish : function(){

        },
        whileplaying : function() {
            
            var position = Math.round(this.position /1000);
            position = position * 1000;

            Session.set("currentPosition", position);

            var comments = Session.get("songComments");

            var currentComment = comments[position];

            if (currentComment) {
                Session.set("currentComment", currentComment); 
            }
          
        }},
        function(sound) {

          sound.play();
          
      }
      );
    }
};

var getComments = function(track) {
    SC.get('/tracks/' + track.id + '/comments', function(resp){
        console.log(resp);
        if (resp.errors) {
            console.log('song does not exist');
        } else {
            comments = resp;
            var commentObject = {};

            for( var i = 1; i < comments.length; i++ ){
                var obj = comments[i];
                if(obj != undefined) {
                    var timestamp = obj.timestamp;
                    timestamp = Math.round(timestamp/1000);
                    timestamp = timestamp * 1000;
                    commentObject[timestamp] = obj.body;
                }
            }

            Session.set("songComments", commentObject);
            Session.set("currentSong", track);
        }
    });    
}

Tracker.autorun(function () {
    var currentSong = Session.get("currentSong");
    playSound(currentSong);
});