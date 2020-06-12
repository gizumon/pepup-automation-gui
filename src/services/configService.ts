import {config as c, IConfig} from 'node-config-ts';
import utils from '../utils/utilityFunctions';

export type IEnvironmentConfig = IConfig;

export interface IRegistRequestConfig {
    loginId: string,
    password: string,
    date: {
        from: string, 
        to: string
    },
    stepsRange: {
        from: string,
        to: string
    }
};

export interface IDateObject {
    date : Date,
    str: {
        date     : string,
        year     : number,
        month    : number,
        day      : number
    }
};

export interface IStepRange {
    from: number,
    to  : number
};

export interface IPepupMeasurementReq_V1 {
    values: [
        {
            source    : 'web',
            source_uid: 'web',
            timestamp : string,
            value     : string,
            value_type: string
        }
    ]
}

export interface IPepupMeasurementReq_V2 {
    source    : 'web',
    source_uid: 'web',
    step_count?: [IMeasurementData_V2],
    sleeping?: [IMeasurementData_V2]
}

export interface IMeasurementData_V2 {
    value: string | number,
    timestamp: string
}

export default class ConfigService {
    private env: IConfig;
    private loginId: string;
    private password: string;
    private fromDate: IDateObject;
    private toDate: IDateObject;
    private stepRange: IStepRange;

    constructor(config: IRegistRequestConfig) {
        this.initialize(config);
    }

    initialize(config: IRegistRequestConfig) {
        this.setEnv(c);
        this.setLoginId(config.loginId);
        this.setPassword(config.password);
        this.setFromDate(new Date(config.date.from));
        this.setToDate(new Date(config.date.to));
        this.setStepRange(config.stepsRange.from, config.stepsRange.to);
    };

    //setter
    setEnv(c: IConfig) { this.env = c; };
    setLoginId(loginId: string) { this.loginId = loginId; };
    setPassword(password: string) { this.password = password; };
    setFromDate(date: Date) { this.fromDate = this.createDateObj(date); };
    setToDate(date: Date) { this.toDate = this.createDateObj(date); };
    setStepRange(from: string, to: string) { this.stepRange = { from: Number(from), to: Number(to) }; };

    //getter
    getLoginId(): string { return this.loginId; };
    getPassword(): string { return this.password; };
    getFromDate(): IDateObject { return this.fromDate; };
    getToDate(): IDateObject { return this.toDate; };
    getStepRange(): IStepRange { return this.stepRange; };
    getEnv() { return this.env; }

    /**
     * Create custom date object
     * @param date date object
     * @return IDateObject
     */
    createDateObj(date: Date) : IDateObject {
        return {
            date: date,
            str: {
                date : utils.getFormattedDate(date, this.getEnv().pepup.configs.dateFormat),
                year : date.getFullYear(),
                month: date.getMonth(),
                day  : date.getDate()
            }
        }
    }
}