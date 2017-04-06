import uniq from 'lodash.uniq';
import uniqBy from 'lodash.uniqby';
import isEmpty from 'lodash.isempty';

import Collections from '../lib/collections.js';
import Schema from '../lib/schema.js';
import Hooks from './hooks.js';

const Organization = {};

/**
 * Create a new organization
 */
Organization.create = function (options, caller) {

  const organization = Object.assign({}, options);

  // Calling hooks
  // For example, to check the user has permission to create a new organization
  // Or to check the permissions of each user is valid
  Hooks.Organization.beforeCreate.forEach((hook) => {
    hook(organization, caller);
  });

  // Clean and validates the object
  Schema.Organization.create.clean(organization);
  Schema.Organization.create.validate(organization);

  // Inserts the organization and returns its ID
  return Collections.Organization.insert(organization, (err, res) => {

    // Hooks to call after organization has been created
    // For example, to notify user of a new organization
    Hooks.Organization.afterCreate.forEach((hook) => {
      hook(err, res, organization, caller);
    });
  });
}

/**
 * Update an organization - should only be used to update the name and/or description
 * @param {string} id - The ID of the organization
 * @param {Object} options - Options object specifying changes to the organization. After cleaning and validation, would be passed to the update method inside a `$set`
 * @return {undefined}
 */
Organization.update = function (id, options = {}, caller) {

  // Ensure the original object is not mutated
  const updateObj = Object.assign({}, options);

  // Calling hooks
  // For example, to check the user has permission to update the organization
  Hooks.Organization.beforeUpdate.forEach((hook) => {
    hook(id, updateObj, caller);
  });

  // Clean and validates the object
  Schema.Organization.update.clean(updateObj);
  Schema.Organization.update.validate(updateObj);

  // Inserts the organization and returns its ID
  Collections.Organization.update({
    _id: id,
    deletedAt: null,
  }, {
    $set: updateObj
  }, (err, n) => {
    // Hooks to call after organization has been update
    // For example, to notify user(s)
    Hooks.Organization.afterUpdate.forEach((hook) => {
      hook(err, n, id, updateObj, caller);
    });
  });

  return true;
}

/**
 * (Soft) Delete an organization
 */
Organization.delete = function (id, caller) {

  // Calling hooks
  // For example, to check the user has permission to delete the organization
  Hooks.Organization.beforeDelete.forEach((hook) => {
    hook(id, caller);
  });

  // Inserts the organization and returns its ID
  Collections.Organization.update({
    _id: id,
    deletedAt: null,
  }, {
    $set: {
      deletedAt: Date.now()
    }
  }, (err, n) => {
    // Hooks to call after organization has been update
    // For example, to notify user(s)
    Hooks.Organization.afterDelete.forEach((hook) => {
      hook(err, n, id, caller);
    });
  });

  return true;
}

/**
 * Add new members to the organization
 */
Organization.addMembers = function (id, members, caller) {

  // Calling hooks
  // For example, to check the user has permission to add members
  Hooks.Organization.beforeAddMembers.forEach((hook) => {
    hook(id, members, caller);
  });

  // Get rid of duplicate members and anonymous members
  const deduplicatedMemberList = uniqBy(members, 'userId').filter(member => typeof member.userId === "string");

  // Get the IDs of the proposed members
  const memberIds = deduplicatedMemberList.map(member => member.userId);

  // Ensures the users exists
  const IdsOfMembersWhoExists = Meteor.users.find({
    _id: {
      $in: memberIds,
    }
  }, {
    fields: {
      _id: 1
    }
  }).fetch().map(userObj => userObj._id);

  // Get a list of proposed members who exists
  const deduplicatedMemberListWhoExists = deduplicatedMemberList.filter(member => IdsOfMembersWhoExists.indexOf(member.userId) > -1);

  // Add an empty permissions object if one is not present
  const membersWithPermissions = deduplicatedMemberListWhoExists.map(member => {
    return Object.assign({}, member, {
      organization: id,
      permissions: Array.isArray(member.permissions) ? member.permissions : [],
    });
  });

  // TODO: Possibly implementing a batch update

  membersWithPermissions.forEach(member => {
    // Clean and validates the object
    Schema.Membership.add.clean(member);
    Schema.Membership.add.validate(member);
  })

  membersWithPermissions.forEach(member => {
    Collections.Membership.upsert({
      userId: member.userId,
      organization: id,
    }, member, (err, n) => {
      // Hooks to call after organization has been update
      // For example, to notify user(s)
      Hooks.Organization.afterAddMembers.forEach((hook) => {
        hook(err, n, id, members, caller);
      });
    });
  });

  return true;

  // Hooks to call after organization has been update
  // For example, to notify user(s)
  Hooks.Organization.afterAddMembers.forEach((hook) => {
    hook(id, membersWithPermissions, caller);
  });
}

/**
 * Removes members from organization
 */
Organization.removeMembers = function (id, members, caller) {

  // Calling hooks
  // For example, to check the user has permission to remove members
  Hooks.Organization.beforeRemoveMembers.forEach((hook) => {
    hook(id, members, caller);
  });

  Collections.Membership.remove({
    userId: { $in: members },
    organization: id,
  }, (err, n) => {
    // Hooks to call after organization has been update
    // For example, to notify user(s)
    Hooks.Organization.afterRemoveMembers.forEach((hook) => {
      hook(err, n, id, members, caller);
    });
  });
  return true;
}
/**
 * 
 */
Organization.changePermissions = function (id, members, permissions, caller) {

  // Calling hooks
  // For example, to check the user has permission to remove members
  Hooks.Members.beforeChangePermissions.forEach((hook) => {
    hook(id, members, permissions, caller);
  });

  Schema.Membership.changePermissionsMembers.clean(members);
  Schema.Membership.changePermissionsMembers.validate(members);

  const queryObj = {
    organization: id,
  };

  if (members.except && Array.isArray(members.except) && members.except.length > 0) {
    queryObj.userId = { $nin: members.except }
  } else if (members.only && Array.isArray(members.only) && members.only.length > 0) {
    queryObj.userId = { $in: members.only }
  }
  
  Schema.Membership.changePermissionsPermissions.clean(permissions);
  Schema.Membership.changePermissionsPermissions.validate(permissions);

  const updateObj = {};

  if (permissions.set && Array.isArray(permissions.set) && permissions.set.length > 0) {
    updateObj.$set = { permissions: permissions.set };
  } else {
    if (permissions.remove && Array.isArray(permissions.remove) && permissions.remove.length > 0) {
      updateObj.$pull = { permissions: { $in: permissions.remove } };
    }
    if (permissions.add && Array.isArray(permissions.add) && permissions.add.length > 0) {
      updateObj.$addToSet = { permissions: { $each: permissions.add } };
    }
  }

  if (!isEmpty(updateObj)) {
    Collections.Membership.update(queryObj, updateObj, {
      multi: true,
    }, (err, n) => {
      // Hooks to call after organization has been update
      // For example, to notify user(s)
      Hooks.Members.afterChangePermissions.forEach((hook) => {
        hook(err, n, id, members, permissions, caller);
      });
    });
    return true;
  }
  return false;
}

export default Organization;
