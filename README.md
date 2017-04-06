# `brewhk:accounts-organization`

Allows users to belong to a certain organization, similar to GitHub organizations.

## Overview

* Members can belong to zero or more organizations
* Organizations can assign arbitrary, user-defined permissions to users (e.g. `admin` or `collaborator`; or `create`, `update`, `delete`)

### Difference with `alanning:roles`

This is similar to [`alanning:roles`](https://github.com/alanning/meteor-roles) but differs in these aspects:

* Details about the organization (i.e. group) and permissions (i.e. roles) are not stored inside the user object, but rather normalized into their own respective collection. This makes searching for roles, members and organizations much faster.
* Organizations can (potentially) have an infinite number of properties, such as `name`, `description`, `slogan` etc.

In our application, we are using `alanning:roles` to manage roles for different platforms that share the same user database. For example, we have a blog, a platform for users, and an internal administrative dashboard. Within the platform for users, we use `brewhk:accounts-organization` to add users to *businesses* (i.e. organizations). For example, Alice and Bob would both be members of Brew, but Alice is also a member of Google.

So Alice and Bob would both have roles `user` in the group `platform` defined with `alanning:roles`. Alice and Bob would then also be members of the organization Brew (represented by a Mongo ID).

## Installation

Run:

```
meteor add brewhk:accounts-organization
```

## API

### Client

First, `import` the library into your code:

```
import Organization from 'meteor/brewhk:accounts-organization';
```

All client-side methods that mutates the data in some way returns with a promise. All client-side functions that (indirectly) queries the database returns with a cursor of the results.

<hr />

#### `create`

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

#### `update`

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

#### `delete`

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

#### `addMembers`

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

#### `removeMembers`

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

#### `changePermissions`

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
