Template.splash.helpers({

});


Template.splash.events({

    "click .sign-in": function (event) {

        Meteor.loginWithFacebook();

    },

});