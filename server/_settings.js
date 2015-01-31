// Provide defaults for Meteor.settings

if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  soundcloud: {
    clientId: "71eb94f201e6b8df2e56c9eaa6f90fc1", 
    secret: "bfb2d0cc2bead3376dadbb3f173b6e8f"
  }
});

ServiceConfiguration.configurations.remove({
  service: "soundcloud"
});
ServiceConfiguration.configurations.insert({
  service: "soundcloud",
  clientId: Meteor.settings.soundcloud.clientId,
  secret: Meteor.settings.soundcloud.secret
});
