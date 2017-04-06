# `brewhk:accounts-organization`

Allows users to belong to a certain organization, similar to GitHub organizations.

# Overview

* Members can belong to zero or more organizations
* Organizations can assign arbitrary, user-defined permissions to users (e.g. `admin` or `collaborator`; or `create`, `update`, `delete`)

## Difference with `alanning:roles`

This is similar to [`alanning:roles`](https://github.com/alanning/meteor-roles) but differs in these aspects:

* Details about the organization (i.e. group) and permissions (i.e. roles) are not stored inside the user object, but rather normalized into their own respective collection. This makes searching for roles, members and organizations much faster.
* Organizations can (potentially) have an infinite number of properties, such as `name`, `description`, `slogan` etc.

In our application, we are using `alanning:roles` to manage roles for different platforms that share the same user database. For example, we have a blog, a platform for users, and an internal administrative dashboard. Within the platform for users, we use `brewhk:accounts-organization` to add users to *businesses* (i.e. organizations). For example, Alice and Bob would both be members of Brew, but Alice is also a member of Google.

So Alice and Bob would both have roles `user` in the group `platform` defined with `alanning:roles`. Alice and Bob would then also be members of the organization Brew (represented by a Mongo ID).

# Installation

Run:

```
meteor add brewhk:accounts-organization
```

# API

## Client

First, `import` the library into your code:

```
import Organization from 'meteor/brewhk:accounts-organization';
```

All client-side methods that mutates the data in some way returns with a promise. All client-side functions that (indirectly) queries the database returns with a cursor of the results.

<hr />

### `create`

Create a new organization.

**Argument(s)**

<small>`*` denotes a required field</small>

* An `Object` with the following properties:
    * `name*` *String* - Display name for the organization. Does not have to be unique.
    * `description` *String* - Description of the organization

**Return Values**

Returns a promise, which:

* resolves with the ID of the new organization (e.g. `L6eFEyhYgHnBt2F3z`), or
* rejected with the error object

**Examples**

Create an organization with no members

```
Organization.create({
  name: "Empty Organization",
  description: "There are no members in this organization",
}).then(res => console.log(res)).catch(err => console.log(err));
```

Create an organization with a single member (see `addMembers` below)

```
Organization.create({
  name: "Organization with One Member",
  description: "There is 1 member in this organization",
}).then(id => {
  Organization.addMembers(id, [{
    userId: 'PpqKunbxPzBXFkT9K',
  }]);
}).catch(err => console.log(err));
```

<hr />

### `update`

Updates an organization.

Note:

* Only the `name` and `description` fields can be updated. If you want to add / remove members or change their permissions, call the `addMembers`, `removeMembers` and / or `changePermissions` methods instead.
* Deleted organizations would not be updated

**Argument(s)**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization to update
* An `Object` with the following properties:
   * `name` *String* - Display name for the organization. Does not have to be unique.
   * `description` *String* - Description of the organization

**Return Values**

Returns a promise, which:

* resolves with `true`, although it does not mean any database entries was changed (e.g. if no organization exists with that ID)
* rejected with the error object

**Examples**

Update an organization with a new name and description

```
Organization.update('C3BWcayYpvTCC8qww', {
  name: "Updated Organization",
  description: Math.random().toString(),
}).then(res => console.log(res)).catch(err => console.log(err));
```

Trying to update a deleted organization would not change anything

```
// Organization with ID `JBijDo8P74H3cvguQ` was deleted with `Organization.delete`
Organization.update('JBijDo8P74H3cvguQ', {
  name: "Trying to update a deleted organization",
  description: "You should not see this text",
}).then(res => console.log(res)).catch(err => console.log(err));
```

<hr />

### `delete`

(Soft) deletes an organization.

**Argument(s)**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization to delete

**Return Values**

Returns a promise, which:

* resolves with `true`, although it does not mean any database entries was changed (e.g. if no organization exists with that ID)
* rejected with the error object

**Examples**

Delete an organization

```
Organization.delete('JBijDo8P74H3cvguQ')
  .then(res => console.log(res)).catch(err => console.log(err));
```

Trying to update a deleted organization would not change anything

```
Organization.update('JBijDo8P74H3cvguQ', {
  name: "Trying to update a deleted organization",
  description: "You should not see this text",
}).then(res => console.log(res)).catch(err => console.log(err));
```

<hr />

### `addMembers`

Add members to the organization.

Note:

* If the member with the ID already exists, it will be replaced with the new member object. This is important as if the `permissions` field is not specified, it will default to `[]`, and this means the existing member would have all permissions removed.

**Arguments**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization to add members to
* `members*` *[Objects]* - an array of members, each member is an object with the following properties:
    * `userId*` *String* - The `_id` of the member's user object
    * `permissions` *[String]* - An array of permission strings

**Return Values**

Returns a promise, which:

* resolves with `true`, although it does not mean any database entries was changed (e.g. if no organization exists with that ID)
* rejected with the error object

**Examples**

Add members with no permissions to the organization

```
Organization.addMembers('JBijDo8P74H3cvguQ', [
  {
    userId: 'PpqKunbxPzBXFkT9K'
  }, {
    userId: 'qgmpHtyKswwrJgs46'
  }, {
    userId: 'D5hR2H2AEo79b4Jpn'
  }, {
    userId: '3e48WKy73dWiAnNK5'
  }
]).then(res => console.log(res)).catch(err => console.log(err));
```

Add members with permissions

```
Organization.addMembers('JBijDo8P74H3cvguQ', [
  {
    userId: 'PpqKunbxPzBXFkT9K',
    permissions: ['manager', 'customer-service']
  }
]).then(res => console.log(res)).catch(err => console.log(err));
```

<hr />

### `removeMembers`

Remove members from organization.

**Arguments**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization to add members to
* `members*` *[String]* - an array of members IDs

**Return Values**

Returns a promise, which:

* resolves with `true`, although it does not mean any database entries was changed (e.g. if no organization exists with that ID)
* rejected with the error object

**Examples**

Remove members from the organization

```
Organization.removeMembers('JBijDo8P74H3cvguQ', ['PpqKunbxPzBXFkT9K'])
  .then(res => console.log(res)).catch(err => console.log(err));
```

<hr />

### `changePermissions`

Change permissions for one or more users in an organization.

**Arguments**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the relevant organization
* `members*` *Object* - an object the defines the constraints of which members this will affect. Any empty object (`{}`) defaults to modifying **all** members of the organization. You can set constraints using the following the following properties:
    * `only` *[String]* - Only apply the permission changes to this array of user IDs
    * `except` *[String]* - Apply the permission changes to all members except this array of user IDs
* `permissions` *Object* - an object that specifies how the permissions will change. It should include one, and only one, of the following properties<sup>†</sup>:
    * `set` *[String]* - Set the permission to the array
    * `add` *[String]* - Add the permissions to the existing array of permissions
    * `remove` *[String]* - Remove the following list of permissions from the existing array of permissions

<small><sup>†</sup> Due to the way Mongo works, we cannot modify the same field using the same operation. Thus we cannot use the `$push` (to add permissions) and `$pull` (to remove permissions) operators at the same time.</small>

**Return Values**

Returns a promise, which:

* resolves with `true` when a database update operation was performed, or `false` if it was not performed (because it didn't need to be updated, for example, due to invalid / conflicting options)
* rejected with the error object

**Examples**

Change permissions of all members of an organization

```
Organization.changePermissions('JBijDo8P74H3cvguQ', {}, {
  set: ["admin", "manager"],
}).then(res => console.log(res)).catch(err => console.log(err));
```

Add permissions to only the specified members

```
Organization.changePermissions('JBijDo8P74H3cvguQ', {
  only: ['PpqKunbxPzBXFkT9K', 'qgmpHtyKswwrJgs46'],
}, {
  add: ["add", "extra", "sauce"],
}).then(res => console.log(res)).catch(err => console.log(err));
```

Remove permissions from all members except those specified

```
Organization.changePermissions('JBijDo8P74H3cvguQ', {
  except: ['D5hR2H2AEo79b4Jpn', '3e48WKy73dWiAnNK5']
}, {
  remove: ["sauce", "manager"],
}).then(res => console.log(res)).catch(err => console.log(err));
```

Add and remove permission from a specific list of users. This would not work, you should update each one sequentially

```
Organization.changePermissions('JBijDo8P74H3cvguQ', {
  only: ['D5hR2H2AEo79b4Jpn']
}, {
  add: ["poo", "foo", "face"],
  remove: ["admin", "manager"],
}).then(res => console.log(res)).catch(err => console.log(err));
```

<hr />

## Server

### Functions

<hr />

#### `create`

Creates a new organization

**Arguments**

<small>`*` denotes a required field</small>

* `options` *Object* - An `Object` with the following properties:
    * `name*` *String* - Display name for the organization. Does not have to be unique.
    * `description` *String* - Description of the organization
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

**Return Values**

The ID of the newly-created organization in the `Organization.Collections.Organization` collection.

<hr />

#### `update`

Update an organization - should only be used to update the name and/or description

**Arguments**

<small>`*` denotes a required field</small>

* `id` *String* - ID of the organization being updated
* `options` *Object* - details about the changes to apply to the organization; after cleaning and validation, would be passed to the update method inside a `$set`. May contain any (or none) of the following properties:
    * `name` *String* - Display name for the organization. Does not have to be unique.
    * `description` *String* - Description of the organization
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

**Return Values**

`true`

<hr />

#### `delete`

(Soft-)deletes an organization

**Arguments**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization being deleted
* `caller*` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

**Return Values**

`true`

<hr />

#### `addMembers`

Add new members to the organization. The function would check that the users with the `userId` exists before adding the members. Anonymous users would not be added. Users who are already members would have their user object replaced by the new specification.

**Arguments**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization to add members to
* `members*` *[Object]* - An array of user objects. User objects with the same `userId` property would be deduplicated first, and the first value encountered would be used (see the [`uniqBy`](https://lodash.com/docs/4.17.4#uniqBy) method of [Lodash](https://lodash.com/) for more details about this deduplication). The following properties are required:
    * `userId*` *String* - `_id` of the user
    * `permissions` *[String]* - An array of strings representing permissions. E.g. `["admin", "manager"]`
* `caller*` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

**Return Values**

`true`

<hr />

#### `removeMembers`

Removes members from organization

**Arguments**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization to remove members from
* `members*` *[String]* - An array of user IDs
* `caller*` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

**Return Values**

`true`

<hr />

#### `changePermissions`

Changes permission(s) for member(s)

**Arguments**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the relevant organization
* `members*` *Object* - an object the defines the constraints of which members this will affect. Any empty object (`{}`) defaults to modifying **all** members of the organization. You can set constraints using the following the following properties:
    * `only` *[String]* - Only apply the permission changes to this array of user IDs
    * `except` *[String]* - Apply the permission changes to all members except this array of user IDs
* `permissions*` *Object* - an object that specifies how the permissions will change. It should include one, and only one, of the following properties<sup>†</sup>:
    * `set` *[String]* - Set the permission to the array
    * `add` *[String]* - Add the permissions to the existing array of permissions
    * `remove` *[String]* - Remove the following list of permissions from the existing array of permissions
* `caller*` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<small><sup>†</sup> Due to the way Mongo works, we cannot modify the same field using the same operation. Thus we cannot use the `$push` (to add permissions) and `$pull` (to remove permissions) operators at the same time.</small>

**Return Values**

Returns `true` when a database update operation was performed, or `false` if it was not performed (because it didn't need to be updated, for example, due to invalid / conflicting options)

<hr />

### Methods

All methods are namespaced under `brewhk:accounts-organization`, so to call the `create` method, you would write:

```
Meteor.apply('brewhk:accounts-organization/create', [options], function (err, res) {})
```

However, you would rarely call the methods directly; instead, you should use the methods provided for the client (e.g. `Organization.create(options)`), which will call the method for you and returns with a promise.

The API for the methods are the same as for the server-side functions specified above, the only difference being the omission of the `caller` parameter, which is passed from the method to the function as the value of `this.userId`. Fro details about the arguments, refer to the specification for the server-side functions.

For example, this is the implementation of the `create` method:

```
'brewhk:accounts-organization/create': function (options) {
  return Organization.create(options, this.userId);
}
```

The following methods are available:

* `create(options)`
* `update(id, options)`
* `delete(id)`
* `addMembers(id, members)`
* `removeMembers(id, members)`
* `changePermissions(id, members, persmissions)`

<hr />

### Publications

All methods are namespaced under `brewhk:accounts-organization`, so to subscribe to the `organization` publication, you would write:

```
Meteor.subscribe('brewhk:accounts-organization/organization', ["a", "b"], () => {})
```

<hr />

#### `organization`

Get the corresponding organization objects from the `Organization.Collections.Organization` collection

**Arguments**

* `ids*` *[String]* - Array of organization IDs

<hr />

#### `membershipForUser`

Get all membership objects related to the user from the `Organization.Collections.Membership` collection

**Arguments**

* `userId*` *String* - `_id` of the user in the `Meteor.users` collection

<hr />

#### `membershipForOrganization`

Get all membership objects related to the organization from the `Organization.Collections.Membership` collection

**Arguments**

* `organizationId*` *String* - `_id` of the organization in the `Organization.Collections.Organization` collection

<hr />

#### `membersOfOrganization`

Get all user objects of members in an organization from the `Meteor.users` collection

**Arguments**

* `organizationId*` *String* - `_id` of the organization in the `Organization.Collections.Organization` collection

<hr />

#### `organizationsOfUser`

Get all objects for organizations for which the user is a member of

**Arguments**

* `userId*` *String* - `_id` of the user in the `Meteor.users` collection

<hr />

### Hooks

Hooks are functions which are ran before or after a certain event, such as an update to the database. For example, after an organization is created, functions `push`ed to the `Hooks.Organization.afterCreate` array would be executed (in the order they were pushed).

There are `before` hooks, which are executed before an action takes place, and `after` hooks, which are executed after an action has succeeded. `before` hooks will always be executed, but `after` hooks would only execute if the operation was successful.

A common use case for `before` hooks is to check whether the user requesting the action has permissions to perform the action; a common use case for `after` hooks is to notify users of the change.

You can throw an error (preferably a `Meteor.Error`) inside any of the hooks to stop downstream execution. For example, if a user does not have permission to perform an action, you can `throw new Meteor.Error('permission-denied')`.

Permissions-specific hooks used during publications are grouped into the `Permissions` object.

To access hooks, you must import them:

```
import Organization, { Hooks, Permissions } from 'meteor/brewhk:accounts-organization';
```

<hr />

#### `Hooks.Organization.beforeCreate`

**Arguments**

* `organization` *Object* - details about the organization being created, containers the following properties:
    * `name` *String* - Display name for the organization. Does not have to be unique.
    * `description` *String* - Description of the organization
* `caller` *String* - User calling the `create` function

<hr />

#### `Hooks.Organization.afterCreate`

**Arguments**

* `err` *Object | undefined* - Error object or `undefined` if there are no errors
* `id` *String* - ID of the organization in the `Organization.Collections.Organization` collection
* `organization` *Object* - details about the organization being created, containers the following properties:
    * `name` *String* - Display name for the organization. Does not have to be unique.
    * `description` *String* - Description of the organization
* `caller` *String* - User calling the function

<hr />

#### `Hooks.Organization.beforeUpdate`

**Arguments**
* `id` *String* - ID of the organization being updated
* `options` *Object* - details about the changes to apply to the organization, may contain any (or none) of the following properties:
    * `name` *String* - Display name for the organization. Does not have to be unique.
    * `description` *String* - Description of the organization
* `caller` *String* - User calling the `update` function

<hr />

#### `Hooks.Organization.afterUpdate`

**Arguments**

* `err` *Object | undefined* - Error object or `undefined` if there are no errors
* `n` *Number* - The number of organizations affected, should always be `1` if the operation was successful
* `id` *String* - The ID of the organization we updated
* `updateObj` *Object* - details about the changes to apply to the organization, may contain any (or none) of the following properties:
    * `name` *String* - Display name for the organization. Does not have to be unique.
    * `description` *String* - Description of the organization
* `caller` *String* - User calling the `update` function

<hr />

#### `Hooks.Organization.beforeDelete`

**Arguments**

* `id` *String* - ID of the organization being deleted
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Hooks.Organization.afterUpdate`

**Arguments**

* `err` *Object | undefined* - Error object or `undefined` if there are no errors
* `n` *Number* - The number of organizations affected, should always be `1` if the operation was successful
* `id` *String* - The ID of the organization we deleted
* `caller` *String* - User calling the `update` function

<hr />

#### `Hooks.Organization.beforeAddMembers`

**Arguments**

* `id` *String* - ID of the organization we're adding members to
* `members` *[Object]* - An array of user objects. The following properties are allowed:
    * `userId` *String* - `_id` of the user (required)
    * `permissions` *[String]* - An array of strings representing permissions. E.g. `["admin", "manager"]`. Not required, and will later on default to an empty array (`[]`)
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Hooks.Organization.afterAddMember`

Called after each time a member is added to the organization

**Arguments**

* `err` *Object | undefined* - Error object or `undefined` if there are no errors
* `n` *Number* - If the user was already a member of the organization, this would be `1`, otherwise `0`
* `id` *String* - ID of the organization we're adding members to
* `member` *Object* - The user object of the member we added. The following properties are guaranteed to be present:
    * `userId` *String* - `_id` of the user
    * `permissions` *[String]* - An array of strings representing permissions. E.g. `["admin", "manager"]`
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Hooks.Organization.afterAddMembers`

Called after the `Organization.addMembers` function has finished running. It does not guarantee that the database operation to add members to the organization has completed; in fact, in most cases, those operations would occur after this hook.

**Arguments**

* `id` *String* - ID of the organization we're adding members to
* `membersWithPermissions` *[Object]* - An array of user object. The following properties are guaranteed to be present in each object:
    * `userId` *String* - `_id` of the user
    * `permissions` *[String]* - An array of strings representing permissions. E.g. `["admin", "manager"]`
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Hooks.Organization.beforeRemoveMembers`

**Arguments**

* `id` *String* - ID of the organization to remove members from
* `members` *[String]* - An array of user IDs
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Hooks.Organization.afterRemoveMembers`

**Arguments**

* `err` *Object | undefined* - Error object or `undefined` if there are no errors
* `n` *Number* - Number of members removed
* `id` *String* - ID of the organization to remove members from
* `members` *[String]* - An array of user IDs that was removed
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Hooks.Organization.beforeChangePermissions`

**Arguments**

* `id` *String* - ID of the organization to change permissions for
* `members*` *Object* - an object the defines the constraints of which members this will affect. Any empty object (`{}`) defaults to modifying **all** members of the organization. You can set constraints using the following the following properties:
    * `only` *[String]* - Only apply the permission changes to this array of user IDs
    * `except` *[String]* - Apply the permission changes to all members except this array of user IDs
* `permissions*` *Object* - an object that specifies how the permissions will change. It should include one, and only one, of the following properties:
    * `set` *[String]* - Set the permission to the array
    * `add` *[String]* - Add the permissions to the existing array of permissions
    * `remove` *[String]* - Remove the following list of permissions from the existing array of permissions
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Hooks.Organization.afterChangePermissions`

**Arguments**

* `err` *Object | undefined* - Error object or `undefined` if there are no errors
* `n` *Number* - Number of members removed
* `id` *String* - ID of the organization
* `members*` *Object* - an object the defines the constraints of which members this will affect. Any empty object (`{}`) defaults to modifying **all** members of the organization. You can set constraints using the following the following properties:
    * `only` *[String]* - Only apply the permission changes to this array of user IDs
    * `except` *[String]* - Apply the permission changes to all members except this array of user IDs
* `permissions*` *Object* - an object that specifies how the permissions will change. It should include one, and only one, of the following properties:
    * `set` *[String]* - Set the permission to the array
    * `add` *[String]* - Add the permissions to the existing array of permissions
    * `remove` *[String]* - Remove the following list of permissions from the existing array of permissions
* `caller` *String* - The ID of the user making the call, or `null` if it is from an anonymous user

<hr />

#### `Permissions.Organization.beforeAccessOrganization`

**Arguments**

* `ids` *[String]* - Array of IDs of the organization the user is trying to access
* `this.userId` *String* - ID of the user making the subscription request

<hr />

#### `Permissions.Organization.beforeAccessMembershipForUser`

**Arguments**

* `userId` *String* - IDs of the user in question
* `this.userId` *String* - ID of the user making the subscription request

<hr />

#### `Permissions.Organization.beforeAccessMembershipForOrganization`

**Arguments**

* `organizationId` *String* - IDs of the organization
* `this.userId` *String* - ID of the user making the subscription request

<hr />

#### `Permissions.Organization.beforeAccessMembersOfOrganization`

**Arguments**

* `organizationId` *String* - IDs of the organization
* `this.userId` *String* - ID of the user making the subscription request

<hr />

#### `Permissions.Organization.beforeAccessOrganizationsOfUser`

**Arguments**

* `userId` *String* - IDs of the user in question
* `this.userId` *String* - ID of the user making the subscription request

<hr />

## Common

The following methods can be ran from both client- and server-side. To get the desired results on the client, you should ensure that you have subscribed to the relevant publications.

For example, to get a list of all organizations a member belongs to, you should do the following:

```
Meteor.subscribe('brewhk:accounts-organization/organizationsOfUser', <user-id>, () => {
  const organizations = Organization.getOrganizationsOfUser(<user-id>);
})
```

By default, published user objects would expose only the following fields:

* `createdAt`
* `username`

<hr />

### `find`

Query for organizations

**Argument(s)**

<small>`*` denotes a required field</small>

* `options*` *Object* - A Mongo selector object

**Return Values**

Returns a cursor of relevant organizations

<hr />

### `findById`

Query for organizations by specifying an ID

**Argument(s)**

<small>`*` denotes a required field</small>

* `id*` *String* - ID of the organization

**Return Values**

Returns a cursor of the organization

<hr />

### `getMembershipsForOrganization`

Retrieve membership objects relating to organization

**Argument(s)**

<small>`*` denotes a required field</small>

* `organizationId*` *String* - ID of the organization

**Return Values**

Returns a cursor of the membership objects

<hr />

### `getMembershipsForUser`

Retrieve membership objects relating to an user

**Argument(s)**

<small>`*` denotes a required field</small>

* `userId*` *String* - ID of the user

**Return Values**

Returns a cursor of the membership objects

<hr />

### `getMemberIdsInOrganization`

Retrieve user IDs of members of an organization

**Argument(s)**

<small>`*` denotes a required field</small>

* `organizationId*` *String* - ID of the organization

**Return Values**

Returns an array of unique user IDs

<hr />

### `getMemberIdsInOrganization`

Retrieve user objects of members of an organization

**Argument(s)**

<small>`*` denotes a required field</small>

* `organizationId*` *String* - ID of the organization

**Return Values**

Returns a cursor of user objects from the `Meteor.users` collection

<hr />

### `getPermissions`

Retrieve a list of all permissions within an organization

**Argument(s)**

<small>`*` denotes a required field</small>

* `organizationId*` *String* - ID of the organization

**Return Values**

Returns an array of permission strings (e.g. `["admin", "manager"]`)

<hr />

### `getMembersWithPermission`

Retrieve a list of user objects who have the specified set of permission(s) within an organization

**Argument(s)**

<small>`*` denotes a required field</small>

* `organizationId*` *String* - ID of the organization
* `permissions` *[String]* - An array of permission strings

**Return Values**

Returns a cursor of user objects from the `Meteor.users` collection

<hr />

### `userHasPermissions`

Checks if a user has a certain set of permission(s) within an organization

**Argument(s)**

<small>`*` denotes a required field</small>

* `organizationId*` *String* - ID of the organization
* `permissions` *[String]* - An array of permission strings
* `userId` *String* - User to check for

**Return Values**

Returns a `Boolean` of whether the user has all the permissions or not

<hr />

### `getOrganizationsOfUser`

Get the organizations that a user is a member of

**Argument(s)**

<small>`*` denotes a required field</small>

* `userId` *String* - User ID

**Return Values**

Returns a cursor of organization objects from the `Organization.Collections.Organization` collection
