var COMMENT_SPEED = 1000;

Template.home.helpers({

  currentLink: function () {
    return Router.current().url;
  },

});

Template.home.events({

    "submit .new-song": function (event) {

        var text = event.target.text.value;
        var track;
        $('.error-message').text("");
        //SC.get("/tracks/" + text, function(resp){
        SC.get('/resolve/?url=' + text, {limit: 1}, function(resp){
          if (resp.errors) {
            $('.error-message').text("That link does not work, please choose a song");
            $('.error-message').removeClass('hide');
            $('#results').addClass('hide');
          } else {
            track = resp;

            // Delete all songs
            Meteor.call("removeAllSongs");

            if (resp.kind == 'track') {
              if (track.streamable == false) {
                $('.error-message').text("SoundCloud doesn't allow streaming of this song");
                $('.error-message').removeClass('hide');
                $('#results').addClass('hide');
              } else {

                Session.set("currentSong", track);

                text = text.replace('/', '%2F');
                $('.error-message').text("");
                Router.go('home', {}, {query: 'song='+text})
                event.target.text.value = "";

              }
            }

            if (resp.kind == 'playlist') {
              var tracks = resp.tracks;
              for (var i = 0 ; i < tracks.length ; i++) {
                if (tracks[i].streamable !== false) {
                  Meteor.call("addSong", tracks[i]);
                }
              }
              var firstSong = Songs.findOne();
              Session.set("currentSong", firstSong);

              text = text.replace('/', '%2F');
              $('.error-message').text("");
              Router.go('home', {}, {query: 'song='+text})
              event.target.text.value = "";

            }
            
          }
        });
        return false;
    },
});

var playSound = function(currentSong) {
  
  soundManager.stopAll();


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
          var nextSong = Session.get("nextSong");
          if (nextSong !== false) {
            var songArray = Session.set("currentSong", nextSong);
          } else {
            closePlayer();
          }
        },
        whileplaying : function() {

            Session.set("currentPosition", this.position);

            var position = Math.round(this.position /COMMENT_SPEED);
            position = position * COMMENT_SPEED;

            var comments = Session.get("songComments");

            var currentComment = comments[position];

            if (currentComment) {
                Session.set("currentComment", currentComment); 
            }

        }},
        function(sound) {

          sound.play();
          Session.set("pauseState", "play");

          var songArray = Songs.find({}).fetch();

          for (var i = 0; i < songArray.length; i++){
            if (songArray[i]._id == currentSong._id) {
              
              if (i+1 < songArray.length) {
                Session.set("nextSong", songArray[i+1]);
              } else {
                Session.set("nextSong", false);
              }

              if (i-1 >= 0) {
                Session.set("previousSong", songArray[i-1]);
              } else {
                Session.set("previousSong", false);
              }
            }
        } 
    });
  }
};

var getComments = function(track, callback) {
    SC.get('/tracks/' + track.id + '/comments', function(resp){
        if (resp.errors) {
        } else {
            comments = resp;
            var commentObject = {};

            for( var i = 1; i < comments.length; i++ ){
                var obj = comments[i];
                if(obj != undefined) {
                    var timestamp = obj.timestamp;
                    timestamp = Math.round(timestamp/COMMENT_SPEED);
                    timestamp = timestamp * COMMENT_SPEED;
                    commentObject[timestamp] = obj.body;
                }
            }
            commentObject[0] = "DRRROPS";

            Session.set("songComments", commentObject);
            callback();
        }
    });    
}

Tracker.autorun(function () {
    var currentSong = Session.get("currentSong");
    if (currentSong) {
      getComments(currentSong, function() {
        playSound(currentSong);
      });
    }
});

Template.home.rendered = function () {
  $('input').focus();
  // setTimeout(function() {
  //   $('form.new-song').fadeIn();
  // }, 2500);

  var song = Router.current().params;
  if(song.query) {
    var songUrl = song.query.song;
    $('.new-song input').val(songUrl);
    //$('.new-song').submit()
  }

  var tid;
  $('#query').keyup(function(e) {
    clearTimeout(tid);
    tid = setTimeout(search, 200);
    $('.error-message').addClass('hide');
    $('#results').removeClass('hide');
  });

  $('#query').keydown(function(e) {
    if (e.keyCode == 40) {
      var results = $('.result-li');
      if (results.length) {
        this.blur();
        results[0].firstElementChild.focus();
      }
    }
  });

  $(document).keydown( function(e) {
    if (e.keyCode == 40) {
        var focusedResult = $(".result:focus");
        if (focusedResult.length > 0) {
          $(".result:focus").closest('li').next().focus();   
        }
    }

    // Up key
    if (e.keyCode == 38) {      
        $(".result:focus").closest('li').prev().focus();   
    }
  });

  $('body').on('click', '.result', goToSong);
    window.addEventListener('popstate',closePlayer)
  };
 

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1563858647192351',
    version    : 'v2.1',
    xfbml      : true
  });
};

function search() {
  $("#results").html('');
  if ( !$("#query").val()) return
  SC.get('/tracks', { q: $('#query').val(), limit: 10 }, function(tracks) {

    tracks.sort(function(a,b){
      return a.comment_count < b.comment_count ? -1 : 1
    })

    for (var i = tracks.length - 1; i >= 0; i--) {
      var track = tracks[i];
      if (track.streamable != false) {
        var $li = $('<li class="result-li">' +
                    '<a class="result clearfix" data-url="' + track.permalink_url + '">' + 
                      track.title + '<span class="artist"> ' + track.user.username + '</span>' +
                      '<span class="comment_count"> <i class="fa fa-comment"></i>' + track.comment_count + '</span>' +
                    '</a>' +
                  '</li>');
        $("#results").append($li);
      }
    };
  });
}

function goToSong() {
  var url = $(this).data('url');
  $('.new-song input').val(url)
  $('.new-song').submit()
}
