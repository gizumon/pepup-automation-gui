import PepupApiService from '../services/pepupApiService';
import PepupRpaService from '../services/pepupRpaService';
import ConfigService, { IPepupConfig } from '../services/configService';


export default class Senario {
    apiService: PepupApiService;
    rpaService: PepupRpaService;
    configService: ConfigService;

    constructor(config: IPepupConfig) {
        this.initialize(config);
    }

    initialize(config: IPepupConfig) {
        this.configService = new ConfigService(config);
        this.apiService = new PepupApiService(this.configService);
        this.rpaService = new PepupRpaService(this.configService);
    };

    async registAll(): Promise<Boolean> {
        let isSuccess = true;
        const from = this.configService.getFromDate();
        const to = this.configService.getToDate();
        if ((from.date.getTime() - to.date.getTime()) / 86400000 > this.configService.getEnv('pepup.daysLimit')) {
            return false;
        }
        await this.rpaService.registAll(from, to).catch(() => isSuccess = false);
        await this.apiService.registAll(from, to).catch(() => isSuccess = false);

        return isSuccess;
    };

}