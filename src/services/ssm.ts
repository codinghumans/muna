import aws from 'aws-sdk';
import chalk from 'chalk';
import MasterKey from '../lib/master-key';

const ssm = new aws.SSM({
	//region: config.aws.region,
});

class SSM {
	async getMasterKey(commitDate: string, commitHash: string): Promise<MasterKey | null> {
		const name = `/secrets/master-key/${commitDate}/${commitHash}`;

		const response = await ssm
			.getParameter({
				Name: name,
			})
			.promise();

		if (response.Parameter && response.Parameter.Value) {
			return MasterKey.from(response.Parameter.Value as string);
		} else {
			return null;
		}
	}

	async putMasterKey(commitDate: string, commitHash: string, key: MasterKey): Promise<void> {
		const name = `/secrets/master-key/${commitDate}/${commitHash}`;

		ssm.putParameter({
			Name: name,
			Value: key.toString(),
			Type: 'SecureString',
			Overwrite: true,
		});

		console.log(`Master key published to SSM ${chalk.green(name)}`);
	}
}

export default new SSM();
