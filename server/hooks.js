const Hooks = {
  Organization: {},
  Members: {},
};

Hooks.Organization.beforeCreate = [];
Hooks.Organization.afterCreate = [];
Hooks.Organization.beforeUpdate = [];

// Called with error(s), number of update organizations, ID of the organization updated, options object, caller;
Hooks.Organization.afterUpdate = [];
Hooks.Organization.beforeDelete = [];

// Called with error(s), number of deleted organizations, ID of the organization deleted, caller
Hooks.Organization.afterDelete = [];

Hooks.Organization.beforeAddMembers = [];
Hooks.Organization.afterAddMembers = [];

Hooks.Organization.beforeRemoveMembers = [];
Hooks.Organization.afterRemoveMembers = [];

Hooks.Members.beforeChangePermissions = [];
Hooks.Members.afterChangePermissions = [];

export default Hooks;
