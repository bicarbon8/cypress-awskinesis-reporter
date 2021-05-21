const utils = require('./utils');
const aws = require('aws-sdk');

class AwsKinesisApi {
    constructor(options) {
        this._options = options;
        this._client = this._options?._client || new aws.Firehose({
            region: this._options.kinesisfirehose_regionendpoint,
            credentials: utils.getCredentials(this._options)
        });
    }

    async sendResults(testName, ...results) {
        var sent = 0;
        for (var i=0; i<results.length; i++) {
            var record = {
                Record: {
                    Data: JSON.stringify(results[i])
                },
                DeliveryStreamName: this._options['kinesisfirehose_deliverystream']
            };
            await new Promise((resolve, reject) => {
                this._client.putRecord(record, (err, data) => {
                    if (err) {
                        utils.warn(`unable to publish record '${JSON.stringify(record)}' to AWS Kinesis due to: ${err}`);
                    } else {
                        sent++;
                    }
                    resolve();
                });
            });
        }
        utils.log(`Published '${sent}' result(s) for: ${testName}.`);
    }
}

module.exports = AwsKinesisApi;