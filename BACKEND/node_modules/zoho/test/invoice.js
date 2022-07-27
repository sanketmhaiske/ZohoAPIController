var assert = require('assert'),
    sinon  = require('sinon'),
    faker  = require('faker'),
    config = require('./config'),
    Zoho   = require('../lib');

var zohoInvoice = new Zoho.Invoice(config.invoice);

// Zoho Invoice
describe('Zoho Invoice', function () {
  it('zohoInvoice should be an instance of Zoho.Invoice', function () {
    assert(zohoInvoice instanceof Zoho.Invoice);
  });

  it('zohoInvoice should have this properties', function () {
    assert(zohoInvoice.protocol);
    assert(zohoInvoice.host);
    assert(zohoInvoice.port);
    assert(zohoInvoice.authtoken);
    assert.equal(zohoInvoice.authtoken, config.invoice.authtoken);
  });

  it('zohoInvoice should have this public functions', function () {
    assert.equal(typeof zohoInvoice.getRecords, 'function');
    assert.equal(typeof zohoInvoice.getRecordById, 'function');
    assert.equal(typeof zohoInvoice.createRecord, 'function');
    assert.equal(typeof zohoInvoice.updateRecord, 'function');
    assert.equal(typeof zohoInvoice.deleteRecord, 'function');
  });

  it('zohoInvoice should have this private functions', function () {
    assert.equal(typeof zohoInvoice._request, 'function');
  });

  // To assign created id;
  var created_id;

  describe('Zoho Requests', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should be able to make requests to Zoho server', function (done) {
      zohoInvoice._request('GET', 'fakeroute', {}, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(response, null); // No response
        assert.equal(typeof error, 'object'); // Found errors
        assert.equal(error.code, 5); // Invalid URL Passed
        assert.equal(error.message, 'Invalid URL Passed');

        done();
      }.bind(this.callback), 1000);
    });
  });

  describe('Create Zoho Invoice records', function () {
    beforeEach(function () {
      this.params = { contact_name: faker.company.companyName() };
      this.callback = sinon.spy();
    });

    it('should create a contact', function (done) {
      zohoInvoice.createRecord('contacts', this.params, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];


        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        created_id = response.contact.contact_id;

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying to create a contact without params', function () {
      zohoInvoice.createRecord('contacts', undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoInvoice.createRecord('contacts', {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoInvoice.createRecord('contacts', null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });
  });

  describe('Get Zoho Invoice records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should get contacts with params argument', function (done) {
      zohoInvoice.getRecords('contacts', {}, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should get contacts without params argument', function (done) {
      zohoInvoice.getRecords('contacts', this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should get a contact by id', function (done) {
      zohoInvoice.getRecordById('contacts', { id: created_id }, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying get a contact without id property', function () {
      zohoInvoice.getRecordById('contacts', { id: undefined }, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoInvoice.getRecordById('contacts', undefined, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoInvoice.getRecordById('contacts', {}, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
      zohoInvoice.getRecordById('contacts', null, this.callback);
      assert.notEqual(this.callback.args[3][0], null);
    });
  });

  describe('Update Zoho Invoice records', function () {
    beforeEach(function () {
      this.params = { contact_name: faker.company.companyName() };
      this.callback = sinon.spy();
    });

    it('should update a contact', function (done) {
      var params = this.params;
      zohoInvoice.updateRecord('contacts', created_id, this.params, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        assert.equal(params.contact_name, response.contact.contact_name);

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying update a contact with id param missing', function () {
      zohoInvoice.updateRecord('contacts', undefined, this.params, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoInvoice.updateRecord('contacts', {}, this.params, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoInvoice.updateRecord('contacts', null, this.params, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

    it('should fail when trying to update a contact without params', function () {
      zohoInvoice.updateRecord('contacts', created_id, undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoInvoice.updateRecord('contacts', created_id, {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoInvoice.updateRecord('contacts', created_id, null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });
  });

  describe('Delete Zoho Invoice records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should delete a contact', function (done) {
      zohoInvoice.deleteRecord('contacts', created_id, this.callback);

      setTimeout(function () {
        assert(this.calledOnce);

        var error = this.args[0][0], response = this.args[0][1];

        assert.equal(error, null); // No response errors
        assert.equal(typeof response, 'object'); // Response
        assert.equal(response.code, 0); // No errors

        done();
      }.bind(this.callback), 1000);
    });

    it('should fail when trying delete a contact with id param missing', function () {
      zohoInvoice.deleteRecord('contacts', undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoInvoice.deleteRecord('contacts', {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoInvoice.deleteRecord('contacts', null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

  });
});
