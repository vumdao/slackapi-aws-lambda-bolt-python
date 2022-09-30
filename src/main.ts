import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { App, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { join } from 'path';
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from './shared/configs';
import { devEnv, EnvironmentConfig } from './shared/environment';

export class SlackAppTest extends Stack {
  constructor(scope: Construct, id: string, reg: EnvironmentConfig, props: StackProps = {}) {
    super(scope, id, props);

    const prefix = `${reg.pattern}-${reg.stage}-slack-app`;

    const role = new Role(this, `${prefix}-lambda-role`, {
      roleName: `${prefix}-lambda-role`,
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        {managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'},
        {managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole'}
      ]
    });

    const lambda = new PythonFunction(this, `${prefix}-lambda-handler`, {
      functionName: `${prefix}-lambda-handler`,
      runtime: Runtime.PYTHON_3_9,
      environment: {
        SLACK_BOT_TOKEN: SLACK_BOT_TOKEN,
        SLACK_SIGNING_SECRET: SLACK_SIGNING_SECRET
      },
      entry: join(__dirname, 'lambda-handler'),
      logRetention: RetentionDays.ONE_DAY,
      role: role,
      timeout: Duration.seconds(10)
    });
    const fnUrl = lambda.addFunctionUrl({authType: FunctionUrlAuthType.NONE});

    new CfnOutput(this, `${prefix}-functionUrl`, {value: fnUrl.url})
  }
}

const app = new App();

new SlackAppTest(app, 'SlackAppLambda', devEnv, {
  description: 'Create Slack App with lambda function',
  env: devEnv
});

app.synth();