import axios, { AxiosRequestConfig } from 'axios';
import ConfigService, { IRegistRequestConfig, IPepupMeasurementReq_V1, IPepupMeasurementReq_V2, IMeasurementData_V2 } from './configService';
import utils from '../utils/utilityFunctions';
import moment from 'moment';

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

    async registAll(fromDate: moment.Moment, toDate: moment.Moment) {
        let errCnt = 0;
        const errLimit = this.configService.getEnv().pepup.configs.errorLimit;

        let targetDate = moment(fromDate);

        console.log('api', targetDate, toDate);
        // roop if regist date is smaller than from date
        while (targetDate.isSameOrBefore(toDate)) {
            console.log('regist from API', targetDate.toLocaleString());
            await Promise.all([
                await this.registStep(targetDate).catch(() => errCnt++),
                await this.registSleeping(targetDate).catch(() => errCnt++)
            ]);

            if (errCnt >= errLimit) {
                throw new Error(`ERROR::[Message]Errors are over the number of limit::[date]Break at ${targetDate.toLocaleString()}`);
                break;
            }
            // Update regist date as the next day
            targetDate.add(1, 'd');
        }
    }

    async registStep(date: moment.Moment) {
        const timestamp = moment.utc(date).toISOString();
        const data = this.createStepData_V2(timestamp);
        console.log('regist step', data);
        const result = await axios.post(this.apiUrl, data, this.getHeaders()).then((res) => {
            console.log(`INFO::[URL]${this.apiUrl}::[Type]steps::[Date]${date}::[Data]${res.data}`);
        }).catch((error) => {
            console.warn(`ERROR::[URL]${this.apiUrl}::[Type]sleeping::[Date]${date}::[Error]`,error);
            throw new Error(`ERROR::[URL]${this.apiUrl}::[Type]steps::[Date]${date}::[Error]${error}`);
        });
    }

    async registSleeping(date: moment.Moment) {
        const timestamp = moment.utc(date).toISOString();
        const data = this.createSleepData_V2(timestamp);
        console.log('regist sleeping', data);
        console.log(this.getHeaders());
        await axios.post(this.apiUrl, data, this.getHeaders()).then((res) => {
            console.log(`INFO::[URL]${this.apiUrl}::[Type]sleeping::[Date]${date}::[Data]${res.data}`);
        }).catch((error) => {
            console.warn(`ERROR::[URL]${this.apiUrl}::[Type]sleeping::[Date]${date}::[Error]`, error);
            throw new Error(`ERROR::[URL]${this.apiUrl}::[Type]sleeping::[Date]${date}::[Error]${error}`);
        });
    }

    private templatePostData_V1(type: string, value: number, timestamp: string): IPepupMeasurementReq_V1 {
        return {
            'values': [
                {
                    'source'    : 'web',
                    'source_uid': 'web',
                    'timestamp' : timestamp,
                    'value'     : String(value),
                    'value_type': String(type)
                }
            ]
        }
    }

    private createSleepData_V1(timestamp: string): IPepupMeasurementReq_V1 {
        const value = Number(this.configService.getEnv().pepup.configs.sleepTime) * 60;
        return this.templatePostData_V1('sleeping', value, timestamp);
    };

    private createStepData_V1(timestamp: string): IPepupMeasurementReq_V1 {
        const min = Number(this.configService.getStepRange().from);
        const max = Number(this.configService.getStepRange().to);
        const value = utils.getRandomInt(min, max);
        return this.templatePostData_V1('step_count', value, timestamp);
    };

    private templatePostData_V2(type: string, value: number, timestamp: string): IPepupMeasurementReq_V2 {
        return {
            'source': 'web',
            'source_uid': 'web',
            [type]: [{
                'value': String(value),
                'timestamp': timestamp
            }]
        };
    };

    private createSleepData_V2(timestamp: string): IPepupMeasurementReq_V2 {
        const value = Number(this.configService.getEnv().pepup.configs.sleepTime) * 60;
        return this.templatePostData_V2('sleeping', value, timestamp);
    };

    private createStepData_V2(timestamp: string): IPepupMeasurementReq_V2 {
        const min = Number(this.configService.getStepRange().from);
        const max = Number(this.configService.getStepRange().to);
        const value = utils.getRandomInt(min, max);
        return this.templatePostData_V2('step_count', value, timestamp);
    };
}
