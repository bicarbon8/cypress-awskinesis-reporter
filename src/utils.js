const chalk = require('chalk');
const aws = require("aws-sdk");

const utils = {
    getCredentials: (options) => {
        var creds;
        switch (options['aws_auth_type']) {
            case 'instance':
                creds = new aws.EC2MetadataCredentials();
                break;
            case 'config':
                if (options['aws_session_token']) {
                    creds = new aws.Credentials(options['aws_access_key_id'], options['aws_secret_access_key'], options['aws_session_token']);
                } else {
                    creds = new aws.Credentials(options['aws_access_key_id'], options['aws_secret_access_key']);
                }
                break;
            case 'environment':
                var env = process.env;
                if (env['aws_session_token']) {
                    creds = new aws.Credentials(env['aws_access_key_id'], env['aws_secret_access_key'], env['aws_session_token']);
                } else {
                    creds = new aws.Credentials(env['aws_access_key_id'], env['aws_secret_access_key']);
                }
                break;
        }
        return creds;
    },
    titleToCaseIds: (title) => {
        var caseIds = [];

        var testCaseIdRegExp = /\bC(\d+)\b/g;
        var matches = [...title.matchAll(testCaseIdRegExp)];
        for (var i=0; i<matches.length; i++) {
            var m = matches[i][1];
            var caseId = parseInt(m);
            caseIds.push(caseId);
        }

        return caseIds;
    },
    getTestStatus: (test) => {
        if (test && !test.pending) {
            switch (test.state) {
                case 'passed':
                    return 0;
                case 'failed':
                default:
                    return 4;
            }
        }
        return 5; // skipped
    },
    getStatusString: (status) => {
        switch (status) {
            case 0:
                return 'passed';
            case 4:
                return 'failed';
            case 5:
            default:
                return 'skipped';
        }
    },
    log: (text) => {
        utils.out('log', text);
    },
    warn: (text) => {
        utils.out('warn', text);
    },
    error: (text) => {
        utils.out('error', text);
    },
    out: (level, text) => {
        console.log('\n', chalk.blue.underline.bold('(AWS Kinesis Reporter)'));
        switch (level) {
            case 'error':
                console.error('\n', chalk.bold.red(' - ' + text) + '\n');
                break;
            case 'warn':
                console.warn('\n', chalk.yellow(' - ' + text), '\n');
                break;
            case 'log':
            default:
                console.info('\n', chalk.blue(' - ' + text), '\n');
                break;
        }
    },
    getFormattedDate: () => {
        var now = new Date();
        var month = `${now.getUTCMonth() + 1}`;
        if (Number(month) < 10) {
            month = `0${month}`;
        }
        var day = `${now.getUTCDate()}`;
        if (Number(day) < 10) {
            day = `0${day}`;
        }
        var hour = `${now.getUTCHours()}`;
        if (Number(hour) < 10) {
            hour = `0${hour}`;
        }
        var min = `${now.getUTCMinutes()}`;
        if (Number(min) < 10) {
            min = `0${min}`;
        }
        var sec = `${now.getUTCSeconds()}`;
        if (Number(sec) < 10) {
            sec = `0${sec}`;
        }
        var milli = `${now.getUTCMilliseconds()}`;
        if (Number(milli) < 100) {
            milli = `0${milli}`;
        }
        if (Number(milli) < 10) {
            milli = `0${milli}`;
        }
        return `${now.getUTCFullYear()}-${month}-${day}T${hour}:${min}:${sec}.${milli}Z`;
    },
    getBuildName: () => {
        var buildName = undefined;
        if (process.env['JOB_NAME']) {
            buildName = process.env['JOB_NAME']; // Jenkins
        }
        if (process.env['TEAMCITY_PROJECT_NAME']) {
            buildName = process.env['TEAMCITY_PROJECT_NAME']; // TeamCity
        }
        if (process.env['bamboo.buildPlanName']) {
            buildName = process.env['bamboo.buildPlanName']; // Bamboo
        }
        if (process.env['TRAVIS_REPO_SLUG']) {
            buildNumber = parseInt(process.env['TRAVIS_REPO_SLUG']); // Travis CI
        }
        return buildName;
    },
    getBuildNumber: () => {
        var buildNumber = undefined;
        if (process.env['BUILD_NUMBER']) {
            buildNumber = parseInt(process.env['BUILD_NUMBER']); // Jenkins or TeamCity
        }
        if (process.env['bamboo.buildNumber']) {
            buildNumber = parseInt(process.env['bamboo.buildNumber']); // Bamboo
        }
        if (process.env['TRAVIS_BUILD_NUMBER']) {
            buildNumber = parseInt(process.env['TRAVIS_BUILD_NUMBER']); // Travis CI
        }
        return buildNumber;
    }
}

module.exports = utils;