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
    console.log(soundManager.setup());
    soundManager.setup({
      useFlashBlock: true,
      debugMode: false,
      debugFlash:true,
      flashVersion: 9,
      preferFlash: true,
      flash9Options: {
        useWaveformData: true,
        usePeakData: true,
        useEQData: true,
      },
      defaultOptions: {
        usePolicyFile: true,
      },
    });
    SC.whenStreamingReady(function() {
      SoundManager.features = {
        eqData: true,
        waveformData: true,
      }
      return
    });
  },    
});