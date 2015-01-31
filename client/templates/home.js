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
            
            Session.set("currentSong", track);

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
        },
        onfinish : function(){

        },
        whileplaying : function() {
           
          Session.set("currentPosition", this.position);
          
        }},
        function(sound) {

          sound.play();
          
        }
    );
  }
};

Tracker.autorun(function () {
    var currentSong = Session.get("currentSong");
    playSound(currentSong);
});