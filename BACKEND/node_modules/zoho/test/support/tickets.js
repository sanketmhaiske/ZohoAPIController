'use strict';

var assert = require('assert'),
    sinon  = require('sinon'),
    faker  = require('faker'),
    config = require('../config'),
    Zoho   = require('../../lib');

var zohoSupport = new Zoho.Support(config.support);
var zohoModule = 'requests';

// Zoho Support
describe('Zoho Support', function () {
  it('zohoSupport should be an instance of Zoho.Support', function () {
    assert(zohoSupport instanceof Zoho.Support);
  });

  it('zohoSupport should have this properties', function () {
    assert(zohoSupport.protocol);
    assert(zohoSupport.host);
    assert(zohoSupport.port);
    assert(zohoSupport.portal);
    assert(zohoSupport.department);
    assert(zohoSupport.authtoken);
    assert.equal(zohoSupport.portal, config.support.portal);
    assert.equal(zohoSupport.department, config.support.department);
    assert.equal(zohoSupport.authtoken, config.support.authtoken);
  });

  it('zohoSupport should have this public functions', function () {
    assert.equal(typeof zohoSupport.getRecords, 'function');
    assert.equal(typeof zohoSupport.getRecordById, 'function');
    assert.equal(typeof zohoSupport.createRecord, 'function');
    assert.equal(typeof zohoSupport.updateRecord, 'function');
    assert.equal(typeof zohoSupport.deleteRecord, 'function');
  });

  it('zohoSupport should have this private functions', function () {
    assert.equal(typeof zohoSupport._request, 'function');
  });

  // To assign created id;
  var created_id;

  describe('Zoho Support Requests', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should be able to make requests to Zoho server', function (done) {
      zohoSupport._request('GET', 'fakeroute', {}, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(response, null); // No response
        assert.equal(typeof error, 'object'); // Found errors
        assert.equal(error.code, 1001);
        assert(/Unable to process your request/.test(error.message));

        done();
      }.bind(this.callback), 1000);
    });
  });

  describe('Create Zoho Support records', function () {
    beforeEach(function () {
      this.params = { 'Contact Name': faker.name.firstName() };
      this.callback = sinon.spy();
    });

    it('should create an ticket', function (done) {
      zohoSupport.createRecord(zohoModule, this.params, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2001); // No errors
        created_id = response.data.Cases.record.id;

        done();
      }.bind(this.callback), 1000);
    });

    it('should create multiple tickets', function (done) {
      zohoSupport.createRecord(zohoModule, [
        { 'Contact Name': faker.name.firstName() },
        { 'Contact Name': faker.name.firstName() },
        { 'Contact Name': faker.name.firstName() }
      ], this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2001); // No errors

        response.data.Cases.record.forEach(function (ticket) {
          zohoSupport.deleteRecord(zohoModule, ticket.id, function () {});
        });

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying to create an ticket without params', function () {
      zohoSupport.createRecord(zohoModule, undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.createRecord(zohoModule, {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.createRecord(zohoModule, [], this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
      zohoSupport.createRecord(zohoModule, null, this.callback);
      assert.notEqual(this.callback.args[3][0], null);
    });
  });

  describe('Get Zoho Support records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should get tickets with params argument', function (done) {
      zohoSupport.getRecords(zohoModule, {}, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should get tickets without params argument', function (done) {
      zohoSupport.getRecords(zohoModule, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should get an ticket by id', function (done) {
      zohoSupport.getRecordById(zohoModule, { id: created_id }, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying get an ticket without id property', function () {
      zohoSupport.getRecordById(zohoModule, { id: undefined }, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.getRecordById(zohoModule, undefined, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.getRecordById(zohoModule, {}, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
      zohoSupport.getRecordById(zohoModule, null, this.callback);
      assert.notEqual(this.callback.args[3][0], null);
    });
  });

  describe('Update Zoho Support records', function () {
    beforeEach(function () {
      this.params = { 'Contact Name': faker.name.firstName() };
      this.callback = sinon.spy();
    });

    it('should update an ticket', function (done) {
      zohoSupport.updateRecord(zohoModule, created_id, this.params, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2002); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying update an ticket with id param missing', function () {
      zohoSupport.updateRecord(zohoModule, undefined, this.params, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.updateRecord(zohoModule, {}, this.params, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.updateRecord(zohoModule, null, this.params, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

    it('should fail when trying to update an ticket without params', function () {
      zohoSupport.updateRecord(zohoModule, created_id, undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.updateRecord(zohoModule, created_id, {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.updateRecord(zohoModule, created_id, null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });
  });

  describe('Delete Zoho Support records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should delete an ticket', function (done) {
      zohoSupport.deleteRecord(zohoModule, created_id, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2003); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying delete an ticket with id param missing', function () {
      zohoSupport.deleteRecord(zohoModule, undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.deleteRecord(zohoModule, {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.deleteRecord(zohoModule, null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

  });
});
