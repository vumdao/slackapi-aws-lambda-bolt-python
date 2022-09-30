import { resolve } from 'path';
import { config } from 'dotenv';
import * as env from 'env-var';

config({ path: resolve(__dirname, '../../.env') }); // Take care of where your .env file, here is project dir

export const CDK_DEFAULT_ACCOUNT = env.get('CDK_DEFAULT_ACCOUNT').required().asString();
export const CDK_DEFAULT_REGION = env.get('CDK_DEFAULT_REGION').required().asString();
export const SLACK_BOT_TOKEN = env.get('SLACK_BOT_TOKEN').required().asString();
export const SLACK_SIGNING_SECRET = env.get('SLACK_SIGNING_SECRET').required().asString();
