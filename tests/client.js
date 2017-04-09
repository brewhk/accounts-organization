import Organizations from 'meteor/brewhk:accounts-organization';

import chai, { expect } from 'chai';
import { spy } from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('brewhk:accounts-organization', function () {
  describe('General', function () {
    it('exports the Organization object', function () {
      expect(Organizations).to.be.an('object');
    });
    it('exports the Organization object with the required shape', function () {
      expect(Organizations).to.contain.all.keys([
        'find',
        'findById',
        'getMembershipsForOrganization',
        'getMembershipsForUser',
        'getMemberIdsInOrganization',
        'getMembersInOrganization',
        'getPermissions',
        'getMembersWithPermission',
        'userHasPermissions',
        'getOrganizationsOfUser',
        'create',
        'update',
        'delete',
        'addMembers',
        'removeMembers',
        'changePermissions',
      ]);
    });
  });
  describe('Write Operations', function () {
    it('should return with a promise', function () {
      expect(Organizations.create({
        name: "Test Organization"
      })).to.be.a('promise');
      expect(Organizations.update('aString', {
        name: "Test Organization"
      })).to.be.a('promise');
    });
    describe('create', function () {
      it('should throw a client-side error when the incorrect arguments are passed', function () {
        expect(Organizations.create()).to.eventually.be.rejectedWith(Error);
        expect(Organizations.create({
          notAKey: '',
        })).to.eventually.be.rejectedWith(Error);
        expect(Organizations.create({
          name: '',
        })).to.eventually.be.rejectedWith(Error);
      });
    });
    describe('update', function () {
      it('should throw a client-side error when the incorrect arguments are passed', function () {
        expect(Organizations.update()).to.eventually.be.rejectedWith(Error);
        expect(Organizations.update(123, {})).to.eventually.be.rejectedWith(Error);
        expect(Organizations.update('aString', {
          'notAKey': '',
        })).to.eventually.be.rejectedWith(Error);
        expect(Organizations.update('aString', {
          'name': 'a',
        })).to.eventually.be.rejectedWith(Error);
      });
      it('should return with true even when the update object is empty', function () {
        expect(Organizations.update('aString', {})).to.eventually.equal(true);
      });
      it('should return with true when correct parameters are passed in', function () {
        expect(Organizations.update('aString', {
          name: 'aString'
        })).to.eventually.equal(true);
      });
    });
  });
});