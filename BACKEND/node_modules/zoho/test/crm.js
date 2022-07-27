'use strict';

var assert = require('assert'),
  sinon = require('sinon'),
  faker = require('faker'),
  libxml = require('libxmljs'),
  http = require('http'),
  config = require('./config'),
  Zoho = require('../lib');

var zohoCRM = new Zoho.CRM(config.crm);

var recordType = ['leads'];

// Zoho CRM
describe('Zoho CRM', function () {
  it('zohoCRM should be an instance of Zoho.CRM', function () {
    assert(zohoCRM instanceof Zoho.CRM);
  });

  it('zohoCRM should have these properties', function () {
    assert(zohoCRM.protocol);
    assert(zohoCRM.host);
    assert(zohoCRM.port);
    assert(zohoCRM.scope);
    assert(zohoCRM.authtoken);
    assert.equal(zohoCRM.scope, config.crm.scope);
    assert.equal(zohoCRM.authtoken, config.crm.authtoken);
  });

  it('zohoCRM should have these public functions', function () {
    assert.equal(typeof zohoCRM.getRecords, 'function');
    assert.equal(typeof zohoCRM.getRecordById, 'function');
    assert.equal(typeof zohoCRM.createRecord, 'function');
    assert.equal(typeof zohoCRM.updateRecord, 'function');
    assert.equal(typeof zohoCRM.deleteRecord, 'function');
    assert.equal(typeof zohoCRM.searchRecords, 'function');
  });

  it('zohoCRM should have these private functions', function () {
    assert.equal(typeof zohoCRM._request, 'function');
    assert.equal(typeof zohoCRM._build, 'function');
  });

  describe('Zoho Build Data', function () {
    beforeEach(function () {
      this.obj = {
        'First Name': faker.name.firstName(),
        'Last Name': faker.name.lastName(),
        Email: faker.internet.email(),
        Phone: faker.phone.phoneNumber(),
        Company: faker.company.companyName(),
        Description: 'Description & §¶e¢¥å1 ©Ã®â€£ër§'
      };
    });

    it('should build XML data from object with wrapper', function () {
      var xml = zohoCRM._build('Quotes', this.obj);
      xml = libxml.parseXml(xml);

      assert.equal(xml.get('row').child(0).text(), this.obj['First Name']);
      assert.equal(xml.get('row').child(1).text(), this.obj['Last Name']);
      assert.equal(xml.get('row').child(2).text(), this.obj.Email);
      assert.equal(xml.get('row').child(3).text(), this.obj.Phone);
      assert.equal(xml.get('row').child(4).text(), this.obj.Company);
      assert.equal(xml.get('row').child(5).text(), this.obj.Description);
    });
  });

  // Used to save the created zoho lead's id;
  let createdId;
  let sandbox;

  // Used to save the updated zoho lead;
  let updatedLead;

  describe('Zoho Requests', function () {

    before(function () {
      sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
      this.callback = sinon.spy();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should be able to make requests to Zoho server', function (done) {
      this.timeout(3000);
      zohoCRM._request('GET', 'fakeroute', {}, function (error, response) {
        assert.equal(response, null);
        assert.equal(typeof error, 'object');
        assert.equal(error.code, 4600);
        assert(/Unable to process your request/.test(error.message));

        done();
      });
    });

    it('should trigger workflows given that config is set', function (done) {
      const _requestSpy = sandbox.spy(zohoCRM, '_request');
      const httpRequestSpy = sandbox.spy(http, 'request');
      this.timeout(5000);
      zohoCRM._request('GET', 'fakeroute', {}, function (error, response) {
        assert.equal(httpRequestSpy.args[0][0].path.indexOf('wfTrigger=true') > -1, true);

        done();
      });
    });
  });

  describe('Create Zoho CRM records', function () {
    beforeEach(function () {
      this.params = {
        'First Name': faker.name.firstName(),
        'Last Name': faker.name.lastName(),
        Email: faker.internet.email(),
        Phone: faker.phone.phoneNumber(),
        Company: faker.company.companyName()
      };
      this.callback = sinon.spy();
    });

    it('should fail when trying to create a lead without params', function () {
      this.timeout(3000);
      zohoCRM.createRecord(recordType[0], undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoCRM.createRecord(recordType[0], {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoCRM.createRecord(recordType[0], [], this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
      zohoCRM.createRecord(recordType[0], null, this.callback);
      assert.notEqual(this.callback.args[3][0], null);
    });

    it('should create a lead', function (done) {
      this.timeout(3000);
      zohoCRM.createRecord(recordType[0], this.params, function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 0);
        createdId = response.data.FL[0].content;

        done();
      });
    });


    it('should add a note to', function (done) {
      this.timeout(3000);
      zohoCRM.createNote(createdId, 'My first note', 'El contenido' , function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');

        done();
      });
    });

    it('should create multiple leads', function (done) {
      this.timeout(3000);
      zohoCRM.createRecord(recordType[0], [{
        'First Name': faker.name.firstName(),
        'Last Name': faker.name.lastName(),
        Company: faker.company.companyName()
      }, {
        'First Name': faker.name.firstName(),
        'Last Name': faker.name.lastName(),
        Company: faker.company.companyName()
      }], function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 0);

        response.data.forEach(function (record) {
          zohoCRM.deleteRecord(recordType[0], record.FL[0].content, function () {});
        });

        done();
      });
    });
  });

  describe('Get Zoho CRM records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should get leads with params argument', function (done) {
      this.timeout(3000);
      zohoCRM.getRecords(recordType[0], {}, function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 0);
        assert(response.data.Leads.row);

        done();
      });
    });

    it('should get leads without params argument', function (done) {
      this.timeout(3000);
      zohoCRM.getRecords(recordType[0], function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 0);
        assert(response.data.Leads.row);

        done();
      });
    });

    it('should fail when trying get a lead without id property', function () {
      this.timeout(3000);
      zohoCRM.getRecordById(recordType[0], {
        id: undefined
      }, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoCRM.getRecordById(recordType[0], undefined, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoCRM.getRecordById(recordType[0], {}, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
      zohoCRM.getRecordById(recordType[0], null, this.callback);
      assert.notEqual(this.callback.args[3][0], null);
    });

    it('should get a lead by id', function (done) {
      this.timeout(3000);
      zohoCRM.getRecordById(recordType[0], {
        id: createdId
      }, function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 0);
        assert(response.data.Leads.row);

        done();
      });
    });
  });

  describe('Update Zoho CRM records', function () {
    beforeEach(function () {
      this.params = {
        'First Name': faker.name.firstName(),
        'Last Name': faker.name.lastName(),
        Company: faker.company.companyName()
      };
      this.callback = sinon.spy();
    });

    it('should fail when trying update a lead with id param missing', function () {
      this.timeout(3000);
      zohoCRM.updateRecord(recordType[0], undefined, this.params, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoCRM.updateRecord(recordType[0], {}, this.params, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoCRM.updateRecord(recordType[0], null, this.params, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

    it('should fail when trying to update an account without params', function () {
      this.timeout(3000);
      zohoCRM.updateRecord(recordType[0], createdId, undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoCRM.updateRecord(recordType[0], createdId, {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoCRM.updateRecord(recordType[0], createdId, null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

    it('should update a lead', function (done) {
      this.timeout(3000);

      updatedLead = this.params; // needed for searchRecords specs
      zohoCRM.updateRecord(recordType[0], createdId, this.params, function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 0);

        done();
      });

    });
  });

  describe('Search Zoho CRM records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should sanitize the criteria param', function (done) {
      var searchCriteria = { criteria: "(Last Name:Amelia{Burrows)" };
      var sanitizedCriteria = "criteria=%28Last%20Name%3AAmelia%7BBurrows%29";
      assert.equal(zohoCRM.sanitizeParams(searchCriteria), sanitizedCriteria);

      done();
    });

    // Commenting out this test because Zoho appears to be using a
    // search engine (e.g., Solr, Elastic, etc.) on the back end
    // that takes 5-10 minutes for our record to appear in search
    xit('should find contact by sanatized criteria param', function (done) {
      this.timeout(3000);

      var params = { criteria: `((First Name:${updatedLead['First Name']})AND(Last Name:${updatedLead['Last Name']}))` };
      zohoCRM.searchRecords(recordType[0], params, function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 0);

        done();
      });
    });
  });

  describe('Delete Zoho CRM records', function () {
    beforeEach(function () {
      this.callback = sinon.spy();
    });

    it('should fail when trying delete a lead with id param missing', function () {
      this.timeout(3000);
      zohoCRM.deleteRecord(recordType[0], undefined, this.callback);
      assert(this.callback.calledOnce);
      assert.notEqual(this.callback.args[0][0], null);
      zohoCRM.deleteRecord(recordType[0], {}, this.callback);
      assert(this.callback.calledTwice);
      assert.notEqual(this.callback.args[1][0], null);
      zohoCRM.deleteRecord(recordType[0], null, this.callback);
      assert(this.callback.calledThrice);
      assert.notEqual(this.callback.args[2][0], null);
    });

    it('should delete a lead', function (done) {
      this.timeout(3000);
      zohoCRM.deleteRecord(recordType[0], createdId, function (error, response) {
        assert.equal(error, null);
        assert.equal(typeof response, 'object');
        assert.equal(response.code, 5000);

        done();
      });

    });
  });
});
