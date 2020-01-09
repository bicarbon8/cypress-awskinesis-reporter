const utils = require('./utils');
const AwsAuth = require('./aws-auth');
const aws = require('aws-sdk');

class AwsKinesisClient {
    constructor(options) {
        this.options = options;
        this.client = new aws.Firehose({
            region: this.options.kinesisfirehose_regionendpoint,
            credentials: AwsAuth.get(this.options)
        });
    }

    async sendResults(testName, ...results) {
        var sent = 0;
        for (var i=0; i<results.length; i++) {
            var record = {
                Record: {
                    Data: JSON.stringify(results[i])
                },
                DeliveryStreamName: this.options['kinesisfirehose_deliverystream']
            };
            await new Promise((resolve, reject) => {
                this.client.putRecord(record, (err, data) => {
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

module.exports = AwsKinesisClient;