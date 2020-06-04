import env from 'config';

export interface IEnvironmentConfig {
    "env": string,
    "service": {
        "uri": string,
        "port": string 
    },
    "google": {
        "scope": [string],
        "token_path": string,
        "credencials_path": string,
        "work_dir": string
    },
    "pepup": {
        "url": {
            "base": string,
            "login": string,
            "api": string,
            "page": string
        },
        "sleepTime": number,
        "format": string
    }
}

export interface IPepupConfig {
    loginId: string,
    password: string,
    date: {
        from: string, 
        to: string
    },
    stepsRange: {
        from: number,
        to: number
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

export interface IPepupMeasurementReq {
    'values': [
        {
            'source'    : 'web',
            'source_uid': 'web',
            'timestamp' : string,
            'value'     : string,
            'value_type': string
        }
    ]
}

export default class ConfigService {
    private fromDate: IDateObject;
    private toDate: IDateObject;
    private stepRange: IStepRange;

    constructor(config: IPepupConfig) {
        this.initialize(config);
    }

    initialize(config: IPepupConfig) {
        this.setFromDate(new Date(config.date.from));
        this.setToDate(new Date(config.date.to));
        this.setStepRange(config.stepsRange.from, config.stepsRange.to);
    };

    setFromDate(date: Date) {
        this.fromDate = this.createDateObj(date);
    };

    setToDate(date: Date) {
        this.toDate = this.createDateObj(date);
    };

    setStepRange(from: number, to: number) {
        this.stepRange = {
            from: from,
            to: to
        };
    };

    getFromDate(): IDateObject {
        return this.fromDate;
    };

    getToDate(): IDateObject {
        return this.toDate;
    };

    getStepRange(): IStepRange {
        return this.stepRange;
    };

    getEnv(key: string) {
        return env.get(key);
    }

    createDateObj(date: Date) : IDateObject {
        return {
            date: date,
            str: {
                date : date.toDateString(),
                year : date.getFullYear(),
                month: date.getMonth(),
                day  : date.getDay()  
            }
        }
    }
}