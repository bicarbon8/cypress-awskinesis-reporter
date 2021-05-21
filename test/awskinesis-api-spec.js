const AwsKinesisApi = require("../src/awskinesis-api");
const utils = require("../src/utils");
const chai = require("chai");
const expect = chai.expect;

describe('AwsKinesisApi', () => {
    
    it('can send a single result', async () => {
        var actualParams;
        var mockClient = {
            putRecord: (params, callback) => {
                actualParams = params;
                callback();
            }
        };
        var testResult = {
            Created: utils.getFormattedDate(),
            TestStatus: 0, // passed
            DurationMs: 12345,
            TestStatusStr: 'passed',
            TestName: 'can send a single result',
            TestFullName: 'AwsKinesisApi can send a single result',
            Source: 'cypress-awskinesis-reporter',
            Version: '2.0.0'
        };
        var api = new AwsKinesisApi({
            _client: mockClient
        });

        await api.sendResults('can send a single result', testResult);

        expect(actualParams).to.exist;
        expect(actualParams.Record).to.exist;
        expect(actualParams.Record.Data).to.exist;
        let recordData = JSON.parse(actualParams.Record.Data);
        expect(recordData).to.exist;
        expect(recordData.TestName).to.equal('can send a single result');
    });

    it('can send a multiple results', async () => {
        var actualParams = [];
        var mockClient = {
            putRecord: (params, callback) => {
                actualParams.push(params);
                callback();
            }
        };
        var testResult = {
            Created: utils.getFormattedDate(),
            TestStatus: 0, // passed
            DurationMs: 12345,
            TestStatusStr: 'passed',
            TestName: 'can send a multiple results',
            TestFullName: 'AwsKinesisApi can send a multiple results',
            Source: 'cypress-awskinesis-reporter',
            Version: '2.0.0'
        };
        var api = new AwsKinesisApi({
            _client: mockClient
        });

        await api.sendResults('can send a multiple results', testResult, testResult, testResult);

        expect(actualParams).to.exist;
        expect(actualParams.length).to.equal(3);
        expect(actualParams[0].Record).to.exist;
        expect(actualParams[0].Record.Data).to.exist;
        let recordData = JSON.parse(actualParams[0].Record.Data);
        expect(recordData).to.exist;
        expect(recordData.TestName).to.equal('can send a multiple results');
    });
});