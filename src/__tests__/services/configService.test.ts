import ConfigService from '../../services/configService';
import moment from 'moment';

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

describe('Config service as data:config1', () => {
    const test1 = new ConfigService(config1);
    it('CASE1: Loging ID should be test_id.', () => {
        expect(test1.getLoginId()).toBe('test_id');
    });
    it('CASE2: Password should be test_id.', () => {
        expect(test1.getPassword()).toBe('test_password');
    });
    it('CASE3: From date should be custom date object.', () => {
        expect(test1.getFromDate()).toEqual(moment.utc('2020-01-01'));
    });
    it('CASE4: From date should be custom date object.', () => {
        expect(test1.getToDate()).toEqual(moment.utc('2020-01-02'));
    });
    it('CASE5: Steps range should be {from: 8000, to: 12000}.', () => {
        expect(test1.getStepRange()).toEqual({from: 8000, to: 12000});
    });
    it('CASE6: Env.name should be pepup automation GUI.', () => {
        expect(test1.getEnv().name).toBe('pepup automation GUI');
    });
    // it('CASE7: Date object should be custom date object.', () => {
    //     expect(test1.createDateObj(new Date('2020-01-01'))).toEqual({
    //         date: new Date('2020-01-01'),
    //         str: {
    //             date: '2020-01-01T00:00:00.000Z',
    //             year: 2020,
    //             month: 0,
    //             day: 1
    //         }
    //     });
    // });
});
