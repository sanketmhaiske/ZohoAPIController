var assert = require('assert'),
    sinon  = require('sinon'),
    faker  = require('faker'),
    config = require('./config'),
    Zoho   = require('../lib');

var zohoSupport = new Zoho.Support(config.support);

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
      this.params = { 'Account Name': faker.company.companyName() };
      this.callback = sinon.spy();
    });

    it('should create an account', function (done) {
      zohoSupport.createRecord('accounts', this.params, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2001); // No errors

        created_id = response.data.Accounts.record.id;

        done();
      }.bind(this.callback), 1000);
    });

    it('should create multiple accounts', function (done) {
      zohoSupport.createRecord('accounts', [
        { 'Account Name': faker.company.companyName() },
        { 'Account Name': faker.company.companyName() },
        { 'Account Name': faker.company.companyName() }
      ], this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2001); // No errors

        response.data.Accounts.record.forEach(function (account) {
          zohoSupport.deleteRecord('accounts', account.id, function () {});
        });

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying to create an account without params', function () {
      zohoSupport.createRecord('accounts', undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.createRecord('accounts', {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.createRecord('accounts', [], this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
      zohoSupport.createRecord('accounts', null, this.callback);
      assert.notEqual(this.callback.args[3][0], null);
    });
  });

  describe('Get Zoho Support records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should get accounts with params argument', function (done) {
      zohoSupport.getRecords('accounts', {}, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should get accounts without params argument', function (done) {
      zohoSupport.getRecords('accounts', this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should get an account by id', function (done) {
      zohoSupport.getRecordById('accounts', { id: created_id }, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying get an account without id property', function () {
      zohoSupport.getRecordById('accounts', { id: undefined }, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.getRecordById('accounts', undefined, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.getRecordById('accounts', {}, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
      zohoSupport.getRecordById('accounts', null, this.callback);
      assert.notEqual(this.callback.args[3][0], null);
    });
  });

  describe('Update Zoho Support records', function () {
    beforeEach(function () {
      this.params = { 'Account Name': faker.company.companyName() };
      this.callback = sinon.spy();
    });

    it('should update an account', function (done) {
      zohoSupport.updateRecord('accounts', created_id, this.params, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2002); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying update an account with id param missing', function () {
      zohoSupport.updateRecord('accounts', undefined, this.params, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.updateRecord('accounts', {}, this.params, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.updateRecord('accounts', null, this.params, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

    it('should fail when trying to update an account without params', function () {
      zohoSupport.updateRecord('accounts', created_id, undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.updateRecord('accounts', created_id, {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.updateRecord('accounts', created_id, null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });
  });

  describe('Delete Zoho Support records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should delete an account', function (done) {
      zohoSupport.deleteRecord('accounts', created_id, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 2003); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying delete an account with id param missing', function () {
      zohoSupport.deleteRecord('accounts', undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoSupport.deleteRecord('accounts', {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoSupport.deleteRecord('accounts', null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

  });
});
