const aws = require('aws-sdk');

var AwsAuth = {
    get: (options) => {
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
    }
}

module.exports = AwsAuth;