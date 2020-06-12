import { IRegistRequestConfig } from './configService';

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
        const dateFrom = new Date(data.date.from);
        const dateTo = new Date(data.date.to);
        const stepFrom = Number(data.stepsRange.from);
        const stepTo = Number(data.stepsRange.to);

        if (dateFrom.toLocaleString() === 'Invalid Date' ||
            dateTo.toLocaleString() === 'Invalid Date'
        ) {
            console.warn(`WARNING::[Message]Invalid date parameter`);
            return false;
        }

        if (isNaN(stepFrom) || isNaN(stepTo)) {
            console.warn(`WARNING::[Message]Invalid steps parameter`);
            return false;            
        }

        if (dateFrom > dateTo) {
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