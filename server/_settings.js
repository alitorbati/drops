// Provide defaults for Meteor.settings

if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  soundcloud: {
    clientId: "ef0d5ca6e55350dd01f3c73c94faebd9", 
    secret: "f65fad5d61643e9560298652bfb8bd4a"
  },
});

ServiceConfiguration.configurations.remove({
  service: "soundcloud"
});
ServiceConfiguration.configurations.insert({
  service: "soundcloud",
  clientId: Meteor.settings.soundcloud.clientId,
  secret: Meteor.settings.soundcloud.secret
});
