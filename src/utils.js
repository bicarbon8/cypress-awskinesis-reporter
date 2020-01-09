const chalk = require('chalk');

var out = (level, text) => {
    console.log('\n', chalk.blue.underline.bold('(AWS Kinesis Reporter)'));
    switch (level) {
        case 'error':
            console.error('\n', chalk.bold.red(' - ' + text) + '\n');
            break;
        case 'warn':
            console.warn('\n', chalk.yellow(' - ' + text), '\n');
            break;
        case 'info':
        case 'log':
        default:
            console.info('\n', chalk.blue(' - ' + text), '\n');
            break;
    }
};

module.exports = {
    titleToCaseIds: (title) => {
        var caseIds = [];
    
        var testCaseIdRegExp = /\bC(\d+)\b/g;
        var m;
        while ((m = testCaseIdRegExp.exec(title)) !== null) {
            let caseId = parseInt(m[1]);
            caseIds.push(caseId);
        }
        return caseIds;
    },
    getTestStatus: (test) => {
        if (!test.pending) {
            switch (test.state) {
                case 'passed':
                    return 0;
                case 'failed':
                default:
                    return 4;
            }
        } else {
            return 5; // skipped
        }
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
        out('log', text);
    },
    warn: (text) => {
        out('warn', text);
    },
    error: (text) => {
        out('error', text);
    },
    /**
     * returns date in format of 2019-11-06T10:59:01.405Z
     */
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
    }
}