import PepupApiService from '../../services/pepupApiService';

// for mock
import ConfigService from '../../services/configService';
import utils from '../../utils/utilityFunctions';
import axios from 'axios';

const config1 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

let isMockError = false;

// jest.mock('axios', () => ({
//     post: (url: string, body: any) => {
//         // if (isMockError) {
//         //     // failed
//         //     console.log('throw')
//         //     throw new Error('failed');
//         //     // return new Promise(resolve => { resolve({data: 'failed', status: 500}); });
//         // } else {
//         //     // success
//         //     console.log('resolved')
//         //     return new Promise(resolve => { resolve({data: 'success', status: 200}); });
//         // }
//         return jest.fn();
//     }
// }));

jest.mock('axios');

// jest.mock('../../utils/utilityFunctions', () => ({
//     getRandomInt: (min: number, max: number) => {
//         return 10000;
//     }
// }));

describe('Pepup api functions [standard]', () => {
    isMockError = false;
    const dummyConfigService = new ConfigService(config1);
    const test = new PepupApiService(dummyConfigService);
    it('CASE1: Do Constructor (initialize)', () => {
        const test1 = new PepupApiService(dummyConfigService);
        expect(test1['apiUrl']).toBe('https://pepup.life/api/v1/@me/measurements');
    });
    it('CASE2: Set session id = dummy_session', () => {
        test.setSessionId('dummy_session');
        expect(test['sessionId']).toBe('dummy_session');
    });
    it('CASE3: Get headers', () => {
        test.setSessionId('dummy_session');
        expect(test['getHeaders']()).toEqual({
            headers: {
                ContentType: 'application/json; charset=UTF-8',
                Cookie: 'pepup_sess=dummy_session'
            }
        });
    });
    it('CASE4: Regist sleeping should be success', async () => {
        (axios.post as any).mockResolvedValue([]);
        await test.registSleeping(new Date('2020-01-01')).then(() => {
            expect('success').toBe('success');
        }).catch(() => {
            expect('failure').toBe('success');
        });
    });
    it('CASE5: Regist step should be success', async () => {
        (axios.post as any).mockResolvedValue([]);
        await test.registStep(new Date('2020-01-01')).then(() => {
            expect('success').toBe('success');
        }).catch(() => {
            expect('failure').toBe('success');
        });
    });
    it('CASE6: Creating post template data should be post object', () => {
        const result = test['templatePostData_V1']('dummy', 0, '2020-01-01T00:00:00.000Z')
        expect(result).toEqual({
            'values': [
                {
                    'source'    : 'web',
                    'source_uid': 'web',
                    'timestamp' : '2020-01-01T00:00:00.000Z',
                    'value'     : '0',
                    'value_type': 'dummy'
                }
            ]
        });
    });
    it('CASE7: Creating Sleep post data should be expected result', () => {
        const result = test['createSleepData_V1']('2020-01-01T00:00:00.000Z')
        expect(result).toEqual({
            'values': [
                {
                    'source'    : 'web',
                    'source_uid': 'web',
                    'timestamp' : '2020-01-01T00:00:00.000Z',
                    'value'     : '420',
                    'value_type': 'sleeping'
                }
            ]
        });
    });
    it('CASE8: Creating Step post data should be expected result', () => {
        jest.spyOn(utils, 'getRandomInt').mockReturnValueOnce(10000);
        const result = test['createStepData_V1']('2020-01-01T00:00:00.000Z');
        expect(result).toEqual({
            'values': [
                {
                    'source'    : 'web',
                    'source_uid': 'web',
                    'timestamp' : '2020-01-01T00:00:00.000Z',
                    'value'     : '10000',
                    'value_type': 'step_count'
                }
            ]
        });
    });
    it('CASE9: Regist all should be success', async () => {
        (axios.post as any).mockResolvedValue([]);
        const from = dummyConfigService.createDateObj(new Date('2020-01-01'));
        const to = dummyConfigService.createDateObj(new Date('2020-01-20'));
        await test.registAll(from, to).then(() => {
            expect('success').toBe('success');
        }).catch(() => {
            expect('failure').toBe('success');
        });
    });
});

describe('Pepup api functions [irregular]', () => {
    const dummyConfigService = new ConfigService(config1);
    const test = new PepupApiService(dummyConfigService);
    it('CASE1: Regist sleeping should be failed', async () => {
        (axios.post as any).mockRejectedValue('error');
        await test.registSleeping(new Date('2020-01-01')).then(() => {
            expect('success').toBe('failure');
        }).catch(() => {
            expect('failure').toBe('failure');
        });
    });
    it('CASE2: Regist step should be failed', async () => {
        await test.registStep(new Date('2020-01-01')).then(() => {
            expect('success').toBe('failure');
        }).catch(() => {
            expect('failure').toBe('failure');
        });
    });
    it('CASE3: Regist all should be failed', async () => {
        const from = dummyConfigService.createDateObj(new Date('2020-01-01'));
        const to = dummyConfigService.createDateObj(new Date('2020-01-20'));
        await test.registAll(from, to).then(() => {
            expect('success').toBe('failure');
        }).catch(() => {
            expect('failure').toBe('failure');
        });
    });
});
