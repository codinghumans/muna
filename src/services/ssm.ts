import aws from 'aws-sdk';
import chalk from 'chalk';
import MasterKey from '../lib/master-key';
import project from './project';

const ssm = new aws.SSM({
	region: project.config?.aws?.region || 'eu-west-1',
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
		const path = `/secrets/master-key`;
		const commitPath = `${path}/${commitDate}/${commitHash}`;
		const latestPath = `${path}/latest`;

		await ssm
			.putParameter({
				Name: commitPath,
				Value: key.toString(),
				Type: 'SecureString',
				Overwrite: true,
			})
			.promise()
			.then(() => {
				return ssm
					.putParameter({
						Name: latestPath,
						Value: key.toString(),
						Type: 'SecureString',
						Overwrite: true,
					})
					.promise();
			});

		console.log(`Master key published to SSM ${chalk.green(commitPath)}`);
		console.log(`Master key published to SSM ${chalk.green(latestPath)}`);
	}
}

export default new SSM();
