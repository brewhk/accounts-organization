import { Meteor } from 'meteor/meteor';

import Organization from '../lib/functions.js';
import Permissions from './permissions.js';

Meteor.publish('brewhk:accounts-organization/organization', function (ids) {
  Permissions.Organization.beforeAccessOrganization.forEach((check) => {
    check(ids, this.userId);
  });
  return Organization.find({
    _id: {
      $in: ids,
    }
  })
});

Meteor.publish('brewhk:accounts-organization/membershipForUser', function (userId) {
  Permissions.Organization.beforeAccessMembershipForUser.forEach((check) => {
    check(userId, this.userId);
  });
  return Organization.getMembershipsForUser(userId);
});

Meteor.publish('brewhk:accounts-organization/membershipForOrganization', function (organizationId) {
  Permissions.Organization.beforeAccessMembershipForOrganization.forEach((check) => {
    check(organizationId, this.userId);
  });
  return Organization.getMembershipsForOrganization(organizationId);
});

Meteor.publish('brewhk:accounts-organization/membersOfOrganization', function (organizationId) {
  Permissions.Organization.beforeAccessMembersOfOrganization.forEach((check) => {
    check(organizationId, this.userId);
  });
  return Organization.getMembersInOrganization(organizationId);
});

Meteor.publish('brewhk:accounts-organization/organizationsOfUser', function (userId) {
  Permissions.Organization.beforeAccessOrganizationsOfUser.forEach((check) => {
    check(userId, this.userId);
  });
  return Organization.getOrganizationsOfUser(userId);
});

export default Organization;
