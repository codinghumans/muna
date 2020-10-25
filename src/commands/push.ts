import { PutParameterRequest } from 'aws-sdk/clients/ssm';
import aws from 'aws-sdk';
import { execSync } from 'child_process';

//const config = require(`${process.cwd()}/muna.config.json`);

const ssm = new aws.SSM({
  //region: config.aws.region,
});

export const push = async () => {
  const lastCommitHash = getLastCommitHash();
  const lastCommitDate = getLastCommitDate();

  await ssmPush(
    lastCommitHash,
    lastCommitDate,
    '1bc32f1091c8bda0920252e233388a2b8b1be03054a5250852cca74b3d12c4d5',
    'c679c428b7957303fe95a9c7d909cb49'
  );

  gitPush();
};

const getLastCommitHash = (): string => {
  return execSync('git rev-parse --short HEAD').toString();
};

const getLastCommitDate = (): string => {
  return execSync('git log -1 --date=short --pretty=format:%cd').toString();
};

const gitPush = () => {
  execSync('git push');
};

const ssmPush = async (commitHash: string, commitDate: string, key: string, iv: string): Promise<void> => {
  await ssm.putParameter(buildSecureSSMParameter(commitHash, commitDate, key, iv)).promise();
  await ssm.putParameter(buildSecureSSMParameter(commitHash, commitDate, key, iv)).promise();
};

const buildSecureSSMParameter = (
  commitHash: string,
  commitDate: string,
  key: string,
  iv: string
): PutParameterRequest => {
  return {
    Name: `/secrets-master-key/${commitDate}/${commitHash}`,
    Value: `${iv}-${key}`,
    Type: 'SecureString',
    Overwrite: true,
  } as PutParameterRequest;
};
