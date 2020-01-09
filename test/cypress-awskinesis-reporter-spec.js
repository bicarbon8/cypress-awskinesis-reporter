const chai = require("chai");
const expect = chai.expect;
const CypressAwsKinesisReporter = require('../src/cypress-awskinesis-reporter');

describe('CypressAwsKinesisReporter', () => {
    it('validates passed in options', () => {
        var runner = new FakeRunner();
        var repOpts = { 
            "kinesisfirehose_deliverystream": "fakeStream-name",
            "kinesisfirehose_regionendpoint": "fake-region-1",
            "aws_auth_type": "config",
            "aws_access_key_id": "fakeAccessKeyId",
            "aws_secret_access_key": "fakeSecretAccessKey"
        };
        var options = {
            reporterOptions: repOpts
        };
        var reporter = new CypressAwsKinesisReporter(runner, options);
        expect(reporter).not.to.be.null;
    });

    it('throws if missing deliverystream', () => {
        var runner = new FakeRunner();
        var repOpts = { 
            "kinesisfirehose_regionendpoint": "fake-region-1",
            "aws_auth_type": "config",
            "aws_access_key_id": "fakeAccessKeyId",
            "aws_secret_access_key": "fakeSecretAccessKey"
        };
        var options = {
            reporterOptions: repOpts
        };
        expect(() => {new CypressAwsKinesisReporter(runner, options);}).to.throw();
    });

    it('throws if missing regionendpoint', () => {
        var runner = new FakeRunner();
        var repOpts = { 
            "kinesisfirehose_deliverystream": "fakeStream-name",
            "aws_auth_type": "config",
            "aws_access_key_id": "fakeAccessKeyId",
            "aws_secret_access_key": "fakeSecretAccessKey"
        };
        var options = {
            reporterOptions: repOpts
        };
        expect(() => {new CypressAwsKinesisReporter(runner, options);}).to.throw();
    });

    it('throws if missing access key and auth type is config', () => {
        var runner = new FakeRunner();
        var repOpts = { 
            "kinesisfirehose_deliverystream": "fakeStream-name",
            "kinesisfirehose_regionendpoint": "fake-region-1",
            "aws_auth_type": "config",
            "aws_secret_access_key": "fakeSecretAccessKey"
        };
        var options = {
            reporterOptions: repOpts
        };
        expect(() => {new CypressAwsKinesisReporter(runner, options);}).to.throw();
    });

    it('throws if missing secret key and auth type is config', () => {
        var runner = new FakeRunner();
        var repOpts = { 
            "kinesisfirehose_deliverystream": "fakeStream-name",
            "kinesisfirehose_regionendpoint": "fake-region-1",
            "aws_auth_type": "config",
            "aws_access_key_id": "fakeAccessKeyId"
        };
        var options = {
            reporterOptions: repOpts
        };
        expect(() => {new CypressAwsKinesisReporter(runner, options);}).to.throw();
    });

    it('does not throw if missing access or secret key and auth type is not config', () => {
        var runner = new FakeRunner();
        var repOpts = { 
            "kinesisfirehose_deliverystream": "fakeStream-name",
            "kinesisfirehose_regionendpoint": "fake-region-1",
            "aws_auth_type": "instance"
        };
        var options = {
            reporterOptions: repOpts
        };
        var reporter = new CypressAwsKinesisReporter(runner, options);
        expect(reporter).not.to.be.null;
    });
});

function FakeRunner() {
    this.stats;
    this.started;
    this.suite;
    this.total;
    this.failures;

    this.grep = (re, invert) => {}
    this.grepTotal = (suite) => {};
    this.globals = (arr) => {};
    this.abort = () => {};
    this.run = (fn) => {};

    this.on = (event, action) => {
        TestStore.store(event, action);
        return this;
    }
}

var TestStore = {
    events: [],
    store: function(event, action) {
        this.events.push({event: event, action: action});
    },
    getEvents: function() {
        return this.events;
    }
}