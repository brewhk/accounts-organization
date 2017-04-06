const Permissions = {
  Organization: {},
  Members: {},
};

Permissions.Organization.beforeAccessOrganization = [];
Permissions.Organization.beforeAccessMembershipForUser = [];
Permissions.Organization.beforeAccessMembershipForOrganization = [];
Permissions.Organization.beforeAccessMembersOfOrganization = [];
Permissions.Organization.beforeAccessOrganizationsOfUser = [];

export default Permissions;
