import axios, { AxiosRequestConfig } from 'axios';
import ConfigService, { IRegistRequestConfig, IDateObject, IPepupMeasurementReq } from './configService';
const utils = require('../utils/utilities');

export default class PepupApiService {
    private configService: ConfigService;

    private apiUrl: string;
    private sessionId: string;

    constructor (configService: ConfigService) {
        this.configService = configService;
        this.initialize();
    }


    private initialize() {
        this.apiUrl = this.configService.getEnv().pepup.url.api;
    }

    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    private getHeaders(): AxiosRequestConfig {
        return {
            headers: {
                ContentType: 'application/json; charset=UTF-8',
                Cookie: 'pepup_sess=' + String(this.sessionId)
            }
        };
    }

    async registAll(fromDateObj: IDateObject, toDateObj: IDateObject) {
        let errCnt = 0;
        const errLimit = this.configService.getEnv().pepup.configs.errorLimit;

        let registDateObj = fromDateObj;

        // roop if regist date is smaller than from date
        while (registDateObj.date <= toDateObj.date && errCnt < errLimit) {
            await Promise.all([
                await this.registStep(registDateObj.date).catch(() => { errCnt++; }),
                await this.registSleeping(registDateObj.date).catch(() => { errCnt++; })
            ]);
            // Update regist date as the next day
            registDateObj = this.configService.createDateObj(new Date(registDateObj.str.year, registDateObj.str.month, registDateObj.str.day + 1));
        }

        if (errCnt > errLimit) {
            return Promise.reject();
        }
    }

    async registStep(date: Date) {
        const data = this.createStepData(utils.getFormattedDate(date, this.configService.getEnv().pepup.configs.dateFormat));
        const res = await axios.post(this.apiUrl, data, this.getHeaders());
        if (res.status < 200 && res.status > 399) {
            // ERROR
            console.warn(`WARNING::[URL]${this.apiUrl}::[Staus]${res.status} ${res.statusText}::[data]${res.data}`);
            return Promise.reject();
        }
        console.log(`INFO::${this.apiUrl}::${res.data}`);
    }

    async registSleeping(date: Date) {
        const data = this.createSleepData(utils.getFormattedDate(date, this.configService.getEnv().pepup.configs.dateFormat));
        const res = await axios.post(this.apiUrl, data, this.getHeaders());
        if (res.status < 200 && res.status > 399) {
            // ERROR
            console.warn(`WARNING::${this.apiUrl}::${res.status} ${res.statusText}::${res.data}`);
            return Promise.reject();
        }
        console.log(`INFO::${this.apiUrl}::${res.data}`);
    }

    private templatePostData(type: string, value: number, timestamp: string): IPepupMeasurementReq {
        return {
            'values': [
                {
                    'source'    : 'web',
                    'source_uid': 'web',
                    'timestamp' : String(timestamp),
                    'value'     : String(value),
                    'value_type': String(type)
                }
            ]
        }
    }

    private createSleepData(date: string) {
        const value = Number(this.configService.getEnv().pepup.configs.sleepTime);
        return this.templatePostData('sleeping', value, date);
    }

    private createStepData(date: string) {
        const min = Number(this.configService.getStepRange().from);
        const max = Number(this.configService.getStepRange().to);
        const value = utils.getRandomInt(min, max);
        return this.templatePostData('step_count', value, date);
    }
}
