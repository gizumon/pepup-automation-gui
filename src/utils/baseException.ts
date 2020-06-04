export interface IErrorConfig {
    'status'?: number,
    'message'?: string,
    'details'?: any
}

export default class BaseException {
    constructor (config: IErrorConfig) {

    }
}
