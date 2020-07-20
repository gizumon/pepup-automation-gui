import { IRegistRequestConfig, IScrapingBulkRequestConfig, IScrapingRequestConfig } from './configService';
import moment from 'moment';
import {config as c} from 'node-config-ts';

// export interface IValidationResult {
//     isValid: 
// }

export default class ValidationService {
    constructor() {}

    validateRegist(data: IRegistRequestConfig): [boolean, string] {
        let message;
        if (!data ||
            !data.loginId ||
            !data.password ||
            !data.date || !data.date.from || !data.date.to ||
            !data.stepsRange || !data.stepsRange.from || !data.stepsRange.to
        ) {
            message = `WARN::[Message]Need to fill all required parameters`;
            console.warn(message);
            return [false, message];
        }
        const dateFrom = moment(data.date.from, c.settings.htmlDateFormat);
        const dateTo = moment(data.date.to, c.settings.htmlDateFormat);
        const stepFrom = Number(data.stepsRange.from);
        const stepTo = Number(data.stepsRange.to);

        if (!dateFrom.isValid() || !dateTo.isValid()) {
            message = `WARN::[Message]Invalid date parameter`;
            console.warn(message);
            return [false, message];
        }

        if (isNaN(stepFrom) || isNaN(stepTo)) {
            message = `WARN::[Message]Invalid steps parameter`;
            console.warn(message);
            return [false, message];       
        }

        if (dateFrom.isAfter(dateTo)) {
            message = `WARN::[Message]Date range is invalid::[Date from]${dateFrom.toLocaleString()}::[Date to]${dateTo.toLocaleString()}`;
            console.warn(message);
            return [false, message];
        }

        if (stepFrom > stepTo) {
            message = `WARN::[Message]Steps range is invalid::[Step from]${stepFrom}::[Step to]${stepTo}`;
            console.warn(message);
            return [false, message];
        }

        return [true, 'INFO::[Message]Success!'];
    }

    validateScraping(data: IScrapingRequestConfig): [boolean, string] {
        let message;
        if (!data ||
            !data.url
        ) {
            message = `WARN::[Message]Need to fill all required parameters`;
            console.warn(message);
            return [false, message];
        }

        return [true, 'INFO::[Message]Success!'];
    }

    validateBulkScraping(data: IScrapingBulkRequestConfig): [boolean, string] {
        let message;
        if (!data ||
            !data.type ||
            !data.configs
        ) {
            message = `WARN::[Message]Need to fill all required parameters`;
            console.warn(message);
            return [false, message];
        }

        if (!Array.isArray(data.configs)) {
            message = `WARN::[Message]Configs should be Array type`;
            console.warn(message);
            return [false, message];
        }
        
        for (let config of data.configs) {
            if (!Array.isArray(config.selectors)) {
                message = `WARN::[Message]Selectors should be Array type`;
                console.warn(message);
                return [false, message];
            }
    
            for (let selector of config.selectors) {
                if (!selector ||
                    !selector.name
                ) {
                    message = `WARN::[Message]Need to fill all required parameters in Selectors`;
                    console.warn(message);
                    return [false, message];
                }
            }
    
        }
        return [true, 'INFO::[Message]Success!'];
    }
}