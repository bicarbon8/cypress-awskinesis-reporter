const chai = require("chai");
const expect = chai.expect;
const utils = require('../src/utils');

describe('utils', () => {
    it('can log to console', () => {
        utils.error('Fake Error');
        utils.warn('Fake Warning');
        utils.log('Fake Message');
    });
});