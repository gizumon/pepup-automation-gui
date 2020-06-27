import PepupApiService from '../services/pepupApiService';
import PepupRpaService from '../services/pepupRpaService';
import ConfigService, { IRegistRequestConfig } from '../services/configService';


export default class Senario {
    apiService: PepupApiService;
    rpaService: PepupRpaService;
    configService: ConfigService;

    loginId: string;

    constructor(config: IRegistRequestConfig) {
        this.initialize(config);
    }

    initialize(config: IRegistRequestConfig) {
        this.configService = new ConfigService(config);
        this.apiService = new PepupApiService(this.configService);
        this.rpaService = new PepupRpaService(this.configService);
        this.loginId = this.configService.getLoginId();
    };

    async login(): Promise<boolean> {
        await this.rpaService.initialize();
        await this.rpaService.login(this.loginId, this.configService.getPassword());
        return await this.rpaService.isLogin();
    }

    async registAll(): Promise<[boolean, string]> {
        let isSuccess = true;
        let message;
        const daysLimit = this.configService.getEnv().pepup.configs.daysLimit;

        const from = this.configService.getFromDate();
        const to = this.configService.getToDate();

        // below 60 days between from date and to date
        if ((from.diff(to, 'days') > daysLimit)) {
            message = `WARNING::[Message]date range need to be below ${daysLimit} days failed...::[ID]${this.loginId}::[from]${from}::[to]${to}::[Code=E000101]`;
            console.warn(message);
            return [false, message];
        }

        const isLogin = await this.login();
        if (isLogin) {
            this.apiService.setSessionId(await this.rpaService.getSettionId());
        } else {
            message = `WARNING::[Message]Login failed...::[ID]${this.loginId}::[Code=E000102]`;
            console.warn(message);
            return [false, message];
        }

        await this.rpaService.registAll(from, to).catch(() => {
            message = `ERROR::[Message]Pepup RPA is failed...::[ID]${this.loginId}::[From]${from}::[To]${to}::[Code=E000103]`;
            console.error(message);
            isSuccess = false;
        });

        await this.apiService.registAll(from, to).catch(() => {
            message = `ERROR::[Message]Pepup API is failed...::[ID]${this.loginId}::[From]${from}::[To]${to}::[Code]::[Code=E000104]`;
            console.error(message);
            isSuccess = false;
        });

        await this.captureAll(from, to);
        return [isSuccess, isSuccess? 'INFO::[Message]Success!::[ID]${this.loginId}': message];
    };

    async captureAll(from: moment.Moment, to: moment.Moment) {
        const target = from;
        while (target.month() <= to.month()) {
            const url = this.configService.getEnv().pepup.url.page + '/' + from.year() + '/' + (from.month() + 1);
            await this.rpaService.captureResult(url, `${target.format('YYYYMMDD')}-${this.loginId}`);
            target.add(1, 'month');
        }
    }
}