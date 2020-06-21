import { IRegistRequestConfig } from './configService';
import moment from 'moment';
import {config as c} from 'node-config-ts';

export default class ValidationService {
    constructor() {}

    validateRequest(data: IRegistRequestConfig): Boolean {
        if (!data ||
            !data.loginId ||
            !data.password ||
            !data.date || !data.date.from || !data.date.to ||
            !data.stepsRange || !data.stepsRange.from || !data.stepsRange.to
        ) {
            console.warn(`WARNING::[Message]Need to fill all required parameters`);
            return false;
        }
        const dateFrom = moment(data.date.from, c.settings.htmlDateFromat);
        const dateTo = moment(data.date.to, c.settings.htmlDateFromat);
        const stepFrom = Number(data.stepsRange.from);
        const stepTo = Number(data.stepsRange.to);

        if (!dateFrom.isValid() || !dateTo.isValid()) {
            console.warn(`WARNING::[Message]Invalid date parameter`);
            return false;
        }

        if (isNaN(stepFrom) || isNaN(stepTo)) {
            console.warn(`WARNING::[Message]Invalid steps parameter`);
            return false;            
        }

        if (dateFrom.isAfter(dateTo)) {
            console.warn(`WARNING::[Message]Date range is invalid::[Date from]${dateFrom.toLocaleString()}::[Date to]${dateTo.toLocaleString()}`);
            return false;
        }

        if (stepFrom > stepTo) {
            console.warn(`WARNING::[Message]Steps range is invalid::[Step from]${stepFrom}::[Step to]${stepTo}`);
            return false;
        }

        return true;
    }
}