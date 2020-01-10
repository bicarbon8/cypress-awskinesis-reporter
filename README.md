# cypress-awskinesis-reporter
a Mocha / Cypress test reporter module for uploading results to AWS Kinesis Firehose

# Install
from your Cypress project, run the following command
```
$ npm install cypress-awkkinesis-reporter --save-dev
```

# Usage

## Configuration
Add the reporter to your `cypress.json`

Ex: using config file based, AWS temporary IAM credentials
```json
...
"reporter": "cypress-awskinesis-reporter",
"reporterOptions": {
    "kinesisfirehose_deliverystream": "your-stream-name",
    "kinesisfirehose_regionendpoint": "eu-west-1",
    "aws_auth_type": "config",
    "aws_access_key_id": "yourAccessKeyId",
    "aws_secret_access_key": "yourSecretAccessKey",
    "aws_session_token": "yourTemporarySessionToken"
}
```

Ex: using EC2 instance based AWS Credentials
```json
"reporter": "cypress-awskinesis-reporter",
"reporterOptions": {
    "kinesisfirehose_deliverystream": "your-stream-name",
    "kinesisfirehose_regionendpoint": "eu-west-1",
    "aws_auth_type": "instance"
}
```

Ex: using environment variable Access Key ID and Secret Access Key
```json
"reporter": "cypress-awskinesis-reporter",
"reporterOptions": {
    "kinesisfirehose_deliverystream": "your-stream-name",
    "kinesisfirehose_regionendpoint": "eu-west-1",
    "aws_auth_type": "environment"
}
```

## Tests
Your Cypress tests results can optionally include a Test ID that uses TestRail's Case ID formatting. To include this, add the Case ID's to your test titles as follows:
```javascript
// Good:
it('C123 C234 Can authenticate as a valid user', () => {...});
it('Can authenticate C123 as a valid user C234', () => {...});

// Bad:
it('C123Can authenticate as a valid user', () => {...});
it('Can authenticate as a valid user (C123)', () => {...});
it('Can authenticate as a valid userC123', () => {...});
it('Can authenticate C123C234 as a valid user', () => {...});
```

# Reporter Options
* `kinesisfirehose_deliverystream` - **REQUIRED** - the AWS Kinesis Firehose Delivery Stream name where messages will be sent
* `kinesisfirehose_regionendpoint` - **REQUIRED** - the location where your AWS Kinesis Firehose endpoint is deployed in AWS. Valid values will look similar to `eu-west-1`, `us-west-2`, etc.
* `aws_auth_type` - **REQUIRED** - the location from where the AWS Credentials should be retrieved. Valid values are `instance` (EC2 Instance Profile credentials), `config` (Cypress' reporterOptions in the `cypress.json` file), and `environment` (read the values from the environment variables)
  * `aws_access_key_id` - if using a value of `config` for `aws_auth_type` you must also include this with a valid IAM Access Key ID
  * `aws_secret_access_key` - if using a value of `config` for `aws_auth_type` you must also include this with a valid IAM Secret Access Key
  * `aws_session_token` - if using a value of `config` for `aws_auth_type` and using Temporary IAM Credentials, you must also include a value for this

# Kinesis Record Data Format
The results uploaded to AWS Kinesis Firehose will have the following format
```javascript
{
    Created: "YYYY-MM-DD:HH:mm:ss.mmmZ",
    TestId: C123, // or null if none exists
    TestStatus: 0, // 0=passed, 4=failed, 5=skipped
    DurationMs: 12334, // milliseconds
    TestStatusStr: "passed", // or "failed" or "skipped"
    TestName: "C123 C234 Can authenticate as a valid user",
    TestFullName: "Authentication Standard User C123 C234 Can authenticate as a valid user",
    Source: "cypress-awskinesis-reporter",
    Version: "1.0.0"
}
```
**NOTE:** Tests referencing multiple Case ID's will upload 1 record for each Case ID

# Author
Jason Holt Smith - [github](https://github.com/bicarbon8)

# License
This project is licensed under the [MIT license](/LICENSE)