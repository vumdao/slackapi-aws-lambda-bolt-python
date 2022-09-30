import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.44.0',
  defaultReleaseBranch: 'master',
  name: 'slack-to-lambda',
  projenrcTs: true,
  deps: [
    'dotenv', 'child_process', 'env-var',
    '@aws-cdk/aws-lambda-python-alpha', '@aws-cdk/aws-apigatewayv2-alpha', '@aws-cdk/aws-apigatewayv2-integrations-alpha'
  ]

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.gitignore.addPatterns('node_modules');
project.gitignore.addPatterns('.env');
project.gitignore.addPatterns('*.yaml');

project.synth();