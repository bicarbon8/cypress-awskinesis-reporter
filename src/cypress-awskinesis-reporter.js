const Mocha = require('mocha');
const utils = require('./utils');
const AwsKinesisApi = require('./awskinesis-api');
const pjson = require('../package.json');
const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;

class CypressAwsKinesisReporter extends Mocha.reporters.Base {
    constructor(runner, options) {
        super(runner, options);
        this.repOpts = this._validateOptions(options);
        this._api = this.repOpts?._api || new AwsKinesisApi(this.repOpts);
        this._results = [];
        this._configureRunner(runner);
    }

    _configureRunner(runner) {
        runner.on(EVENT_TEST_PASS, async (test) => {
            await this._submitResults(test);
        }).on(EVENT_TEST_FAIL, async (test, err) => {
            await this._submitResults(test, err);
        });
    }

    _validateOptions(options) {
        if (!options) {
            throw new Error('Missing cypress.json');
        }
        var reporterOptions = options.reporterOptions;
        if (!reporterOptions) {
            throw new Error('Missing reporterOptions in cypress.json');
        }
        this._validate(reporterOptions, 'kinesisfirehose_regionendpoint');
        this._validate(reporterOptions, 'kinesisfirehose_deliverystream');
        this._validate(reporterOptions, 'aws_auth_type');
        if (reporterOptions['aws_auth_type'] == 'config') {
            this._validate(reporterOptions, 'aws_access_key_id');
            this._validate(reporterOptions, 'aws_secret_access_key');
        }
        return reporterOptions;
    }

    _validate(options, name) {
        if (options[name] === null || options[name] === undefined) {
            throw new Error(`Missing ${name} value. Please update reporterOptions in cypress.json`);
        }
    }

    async _submitResults(test, err) {
        var caseIds = utils.titleToCaseIds(test.title);
        var caseResults = [];
        if (caseIds?.length) {
            caseResults = caseIds.map(caseId => {
                return this._createResultFromTest(test, caseId, err);
            });
        } else {
            caseResults.push(this._createResultFromTest(test, undefined, err));
        }
        await this._api.sendResults(test.title, ...caseResults);
    }

    _createResultFromTest(test, id, err) {
        var testResult = {
            Created: utils.getFormattedDate(),
            TestId: id,
            TestStatus: utils.getTestStatus(test),
            DurationMs: test.duration,
            TestStatusStr: utils.getStatusString(status),
            TestName: test.title,
            TestFullName: test.fullTitle(),
            BuildName: utils.getBuildName(),
            BuildNumber: utils.getBuildNumber(),
            Source: pjson.name,
            Version: pjson.version,
            ErrorMessage: err
        };
        return testResult;
    };
}

module.exports = CypressAwsKinesisReporter;
