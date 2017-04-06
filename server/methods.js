import { Meteor } from 'meteor/meteor';

import Organization from './functions.js';

Meteor.methods({
	'brewhk:accounts-organization/create': function (options) {
		return Organization.create(options, this.userId);
	},
	'brewhk:accounts-organization/update': function (id, options) {
		return Organization.update(id, options, this.userId);
	},
	'brewhk:accounts-organization/delete': function (id) {
		return Organization.delete(id, this.userId);
	},
	'brewhk:accounts-organization/addMembers': function (id, members) {
		return Organization.addMembers(id, members, this.userId);
	},
	'brewhk:accounts-organization/removeMembers': function (id, members) {
		return Organization.removeMembers(id, members, this.userId);
	},
	'brewhk:accounts-organization/changePermissions': function (id, members, persmissions) {
		return Organization.changePermissions(id, members, persmissions, this.userId);
	},
});
