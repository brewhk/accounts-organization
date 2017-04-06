import Collections from './collections.js';
import * as Settings from './settings.js';

const Organization = {};
Organization.Settings = Settings;

/**
 * Find organization using Mongo selectors
 */
Organization.find = function (options) {
  return Collections.Organization.find(options);
}

/**
 * Find organization by ID
 */
Organization.findById = function (id) {
  return Organization.find(id);
}


/**
 * Retrieve membership objects relating to organization
 * @param {string} organizationId ID of the organization
 */
Organization.getMembershipsForOrganization = function (organizationId) {
  return Collections.Membership.find({
    organization: organizationId,
  });
}

/**
 * Retrieve membership objects relating to organization
 * @param {string} _id ID of the user
 */
Organization.getMembershipsForUser = function (userId) {
  return Collections.Membership.find({
    userId: userId,
  });
}

/**
 * Retrieve a list of member IDs
 */
Organization.getMemberIdsInOrganization = function (organizationId) {
  const membership = Organization.getMembershipsForOrganization(organizationId).fetch();
  return uniq(membership.map(member => member.userId));
}

/**
 * Retrieve a list of members
 */
Organization.getMembersInOrganization = function (organizationId) {
  return Meteor.users.find({
    _id: {
      $in: Organization.getMemberIdsInOrganization(organizationId),
    }
  }, {
    fields: Organization.Settings.PUBLIC_USER_FIELDS,
  });
}

/**
 * Retrieve a list of all permissions within an organization
 */
Organization.getPermissions = function (organizationId) {
  const memberships = Organization.getMembershipsForOrganization(organizationId).fetch();
  return memberships.reduce(a, membership => a.concat(membership.permissions), []);
}

/**
 * Retrieves a list of members which has a certain permission
 */
Organization.getMembersWithPermission = function (oid, permissions) {
  const memberships = Collections.Membership.find({
    organization: oid,
    permissions: {
      $in: permissions,
    }
  }).fetch();

  const memberIds = memberships.map(membership => membership.userId);

  return Meteor.users.find({
    _id: {
      $in: memberIds,
    }
  }, {
    fields: Organization.Settings.PUBLIC_USER_FIELDS,
  })
}

/**
 * Checks if a user has a certain set of permission(s) within an organization
 */
Organization.userHasPermissions = function (oid, permissions, userId) {
  return Collections.Membership.find({
    organization: oid,
    userId: userId,
    permissions: {
      $all: permissions,
    }
  }).count() > 0;
}

/**
 * Get the organizations that a user is a member of
 */
Organization.getOrganizationsOfUser = function (userId) {
  const memberships = Collections.Membership.find({
    userId: userId,
  }).fetch();
  const organizationIds = memberships.map(Membership => Membership.organization);
  return Organization.find({
    _id: {
      $in: organizationIds,
    }
  })
}

export default Organization;
