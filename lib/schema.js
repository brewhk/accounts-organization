import SimpleSchema from 'simpl-schema';

const Schema = {
  Membership: {},
  Organization: {},
};

Schema.Membership.add = new SimpleSchema({
  userId: String,
  organization: String,
  permissions: {
    type: Array,
    defaultValue: [],
  },
  'permissions.$': { type: String }
});

Schema.Membership.changePermissionsMembers = new SimpleSchema({
  except: {
    type: Array,
    optional: true,
  },
  'except.$': { type: String },
  only: {
    type: Array,
    optional: true,
  },
  'only.$': { type: String },
});

Schema.Membership.changePermissionsPermissions = new SimpleSchema({
  add: {
    type: Array,
    optional: true,
  },
  'add.$': { type: String },
  remove: {
    type: Array,
    optional: true,
  },
  'remove.$': { type: String },
  set: {
    type: Array,
    optional: true,
  },
  'set.$': { type: String },
});

Schema.Organization.create = new SimpleSchema({
  name: String,
  description: {
    type: String,
    defaultValue: "",
  },
});

Schema.Organization.update = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
});

export default Schema;