const Organization = {};

Organization.create = function (options) {
  return new Promise(function (resolve, reject) {
    Meteor.apply('brewhk:accounts-organization/create', [options], function (err, res) {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  })
}

Organization.update = function (id, options) {
  return new Promise(function (resolve, reject) {
    Meteor.apply('brewhk:accounts-organization/update', [id, options], function (err, res) {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  })
}

Organization.delete = function (id) {
  return new Promise(function (resolve, reject) {
    Meteor.apply('brewhk:accounts-organization/delete', [id], function (err, res) {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  })
}

Organization.addMembers = function (id, members) {
  return new Promise(function (resolve, reject) {
    Meteor.apply('brewhk:accounts-organization/addMembers', [id, members], function (err, res) {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  })
}

Organization.removeMembers = function (id, members) {
  return new Promise(function (resolve, reject) {
    Meteor.apply('brewhk:accounts-organization/removeMembers', [id, members], function (err, res) {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  })
}

Organization.changePermissions = function (id, members, permissions) {
  return new Promise(function (resolve, reject) {
    Meteor.apply('brewhk:accounts-organization/changePermissions', [id, members, permissions], function (err, res) {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  })
}

export default Organization;
