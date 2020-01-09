const Mocha = require('mocha');
const utils = require('./utils');
const AwsAuth = require('./aws-auth');
const AwsKinesisApi = require('./awskinesis-api');
const aws = require('aws-sdk');
const pjson = require('../package.json');
const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;

class CypressAwsKinesisReporter {
    constructor(runner, options) {
        this.repOpts = this.validateOptions(options);
        this.api = new AwsKinesisApi(this.repOpts);
        this.results = [];
        this.configureRunner(runner);
    }

    configureRunner(runner) {
        runner
            .on(EVENT_TEST_PASS, async (test) => {
                await this.submitResults(test);
            })
            .on(EVENT_TEST_FAIL, async (test, err) => {
                await this.submitResults(test, err);
            });
    }

    validateOptions(options) {
        if (!options) {
            throw new Error('Missing cypress.json');
        }
        var reporterOptions = options.reporterOptions;
        if (!reporterOptions) {
            throw new Error('Missing reporterOptions in cypress.json');
        }
        this.validate(reporterOptions, 'kinesisfirehose_regionendpoint');
        this.validate(reporterOptions, 'kinesisfirehose_deliverystream');
        this.validate(reporterOptions, 'aws_auth_type');
        if (reporterOptions['aws_auth_type'] === 'config') {
            this.validate(reporterOptions, 'aws_access_key_id');
            this.validate(reporterOptions, 'aws_secret_access_key');
        }
        return reporterOptions;
    }

    validate(options, name) {
        if (options[name] == null) {
            throw new Error(`Missing ${name} value. Please update reporterOptions in cypress.json`);
        }
    }

    async submitResults(test, err) {
        var caseIds = utils.titleToCaseIds(test.title);
        var caseResults = [];
        if (caseIds && caseIds.length > 0) {
            caseResults = caseIds.map(caseId => {
                return this.createResultFromTest(test, caseId, err);
            });
        } else {
            caseResults.push(this.createResultFromTest(test, null, err));
        }
        await this.api.sendResults(test.title, ...caseResults);
    }

    createResultFromTest(test, id, err) {
        var status = utils.getTestStatus(test);
        var statusStr = utils.getStatusString(status);
        var created = utils.getFormattedDate();
        var testResult = {
            Created: created,
            TestId: id,
            TestStatus: status,
            DurationMs: test.duration,
            TestStatusStr: statusStr,
            TestName: test.title,
            TestFullName: test.fullTitle(),
            Source: pjson.name,
            Version: pjson.version
        };
        if (err) {
            testResult['ErrorMessage'] = err;
        }
        return testResult;
    };
}

module.exports = CypressAwsKinesisReporter;
