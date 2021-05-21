const chai = require("chai");
const expect = chai.expect;
const utils = require('../src/utils');

describe('utils', () => {
    it('can log to console', () => {
        utils.error('Fake Error');
        utils.warn('Fake Warning');
        utils.log('Fake Message');
    });

    it('can get credentials from options', () => {
        var creds = utils.getCredentials({
            aws_auth_type: 'config',
            aws_access_key_id: 'fake_access_key_id',
            aws_secret_access_key: 'fake_secret_access_key',
            aws_session_token: 'fake_session_token'
        });
        expect(creds).to.exist;
        expect(creds.accessKeyId).to.equal('fake_access_key_id');
        expect(creds.secretAccessKey).to.equal('fake_secret_access_key');
        expect(creds.sessionToken).to.equal('fake_session_token');
    });

    var titleData = [
        {title: '', expected: []},
        {title: 'C1234', expected: [1234]},
        {title: 'foo C1234', expected: [1234]},
        {title: 'C1234 foo', expected: [1234]},
        {title: 'foo C1234 foo', expected: [1234]},
        {title: 'C1234 C2345', expected: [1234, 2345]},
        {title: 'foo C1234 C2345', expected: [1234, 2345]},
        {title: 'C1234 foo C2345', expected: [1234, 2345]},
        {title: 'C1234 C2345 foo', expected: [1234, 2345]},
        {title: 'foo C1234 foo C2345 foo', expected: [1234, 2345]},
        {title: 'fooC1234 fooC2345', expected: []},
        {title: 'fooC1234C2345', expected: []},
        {title: 'C1234foo C2345foo', expected: []},
        {title: 'Case name 1234', expected: []},
        {title: 'Case1234', expected: []},
    ];
    titleData.forEach((data) => {
        it(`can get test cases from test title: ${JSON.stringify(data)}`, () => {
            var cases = utils.titleToCaseIds(data.title);
            expect(cases).to.eql(data.expected);
        });
    });
});