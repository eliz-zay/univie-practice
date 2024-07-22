import { NestFactory } from '@nestjs/core';
import { ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } from 'web3';

import { DeploymentModule } from './deployment.module';
import { EthereumService, MonitoringContractService } from './service';
import { ConfigService } from '@nestjs/config';

/**
 * Helper class to calculate adjusted gas value that is higher than estimate
 */
class GasHelper {
    static mulptiplier = 1.2 // Increase by 20%

    static gasPay(limit: string): string {
        return Math.ceil(Number(limit) * GasHelper.mulptiplier).toString()
    }
}

async function bootstrap() {
    const app = await NestFactory.create(DeploymentModule);

    const monitoringContractService = app.get(MonitoringContractService);
    const ethereumService = app.get(EthereumService);
    const configService = app.get(ConfigService);

    const contract = monitoringContractService.getContract();
    const bytecode = monitoringContractService.getBytecode();
    const web3 = ethereumService.getWeb3();
    const account = ethereumService.getAccount();

    const signerNumber = Number(configService.getOrThrow('DEPLOYMENT_SIGNER_NUMBER'));

    const instance = contract.deploy({
        data: bytecode,
        arguments: [signerNumber] as any // contract constructor args
    });

    const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
    const gasLimit = await instance.estimateGas(
        { from: account },
        DEFAULT_RETURN_FORMAT, // the returned data will be formatted as a bigint
    );

    const tx = await instance.send({
        from: account,
        gasPrice,
        gas: GasHelper.gasPay(String(gasLimit)) // gas limit for transaction
    });
    
    const contractAddress = tx.options.address;
    console.log('Monitoring contract deployed at: ', contractAddress);
}

bootstrap();
