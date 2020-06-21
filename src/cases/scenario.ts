import PepupApiService from '../services/pepupApiService';
import PepupRpaService from '../services/pepupRpaService';
import ConfigService, { IRegistRequestConfig } from '../services/configService';


export default class Senario {
    apiService: PepupApiService;
    rpaService: PepupRpaService;
    configService: ConfigService;

    constructor(config: IRegistRequestConfig) {
        this.initialize(config);
    }

    initialize(config: IRegistRequestConfig) {
        this.configService = new ConfigService(config);
        this.apiService = new PepupApiService(this.configService);
        this.rpaService = new PepupRpaService(this.configService);
    };

    async registAll(): Promise<Boolean> {
        let isSuccess = true;
        const daysLimit = this.configService.getEnv().pepup.configs.daysLimit;

        const loginId = this.configService.getLoginId();
        const password = this.configService.getPassword();
        const from = this.configService.getFromDate();
        const to = this.configService.getToDate();

        // below 60 days between from date and to date
        if ((from.diff(to, 'days') > daysLimit)) {
            console.warn(`WARNING::[Message]date range need to be below ${daysLimit} days failed...::[from]${from}::[to]${to}`);
            return false;
        }

        await this.rpaService.initialize();
        await this.rpaService.login(loginId, password);
        const isLogin = await this.rpaService.isLogin();
        console.log(isLogin);
        if (!isLogin) {
            console.warn(`WARNING::[Message]Login failed...::[login ID]${loginId}`);
            return false;
        }

        await this.rpaService.registAll(from, to).catch(() => {
            console.error(`ERROR::[Message]Pepup RPA is failed...::[from]${from}::[to]${to}`);
            isSuccess = false;
        });
        this.apiService.setSessionId(await this.rpaService.getSettionId());
        await this.apiService.registAll(from, to).catch(() => {
            console.error(`ERROR::[Message]Pepup RPA is failed...::[from]${from}::[to]${to}`);
            isSuccess = false;
        });

        return isSuccess;
    };

}