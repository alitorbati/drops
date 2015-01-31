Template.loading.rendered = function () {
  if ( ! Session.get('loadingSplash') ) {
    this.loading = window.pleaseWait({
      logo: '/images/Meteor-logo.png',
      backgroundColor: '#2c3e50',
      loadingHtml: spinner
    });
    Session.set('loadingSplash', true); // just show loading splash once
  }
};

Template.loading.destroyed = function () {
  if ( this.loading ) {
    this.loading.finish();
  }
};

var spinner = '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';