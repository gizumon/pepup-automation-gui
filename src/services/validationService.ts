import { IRegistRequestConfig } from './configService';
import moment from 'moment';
import {config as c} from 'node-config-ts';

// export interface IValidationResult {
//     isValid: 
// }

export default class ValidationService {
    constructor() {}

    validateRequest(data: IRegistRequestConfig): [boolean, string] {
        let message;
        if (!data ||
            !data.loginId ||
            !data.password ||
            !data.date || !data.date.from || !data.date.to ||
            !data.stepsRange || !data.stepsRange.from || !data.stepsRange.to
        ) {
            message = `WARNING::[Message]Need to fill all required parameters`;
            console.warn(message);
            return [false, message];
        }
        const dateFrom = moment(data.date.from, c.settings.htmlDateFormat);
        const dateTo = moment(data.date.to, c.settings.htmlDateFormat);
        const stepFrom = Number(data.stepsRange.from);
        const stepTo = Number(data.stepsRange.to);

        if (!dateFrom.isValid() || !dateTo.isValid()) {
            message = `WARNING::[Message]Invalid date parameter`;
            console.warn(message);
            return [false, message];
        }

        if (isNaN(stepFrom) || isNaN(stepTo)) {
            message = `WARNING::[Message]Invalid steps parameter`;
            console.warn(message);
            return [false, message];       
        }

        if (dateFrom.isAfter(dateTo)) {
            message = `WARNING::[Message]Date range is invalid::[Date from]${dateFrom.toLocaleString()}::[Date to]${dateTo.toLocaleString()}`;
            console.warn(message);
            return [false, message];
        }

        if (stepFrom > stepTo) {
            message = `WARNING::[Message]Steps range is invalid::[Step from]${stepFrom}::[Step to]${stepTo}`;
            console.warn(message);
            return [false, message];
        }

        return [true, 'INFO::[Message]Success!'];
    }
}