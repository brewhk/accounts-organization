Package.describe({
  name: 'brewhk:accounts-organization',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Allows users to belong to a certain organization, similar to GitHub organizations.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/brewhk/accounts-organization.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "simpl-schema": "0.2.3",
  "lodash.uniq": "4.5.0",
  "lodash.uniqby": "4.7.0",
  "lodash.isempty": "4.4.0",
})

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
  api.use(['ecmascript', 'mongo', 'accounts-base@1.2.15']);
  api.mainModule('client/main.js', 'client');
  api.mainModule('server/main.js', 'server');
});
