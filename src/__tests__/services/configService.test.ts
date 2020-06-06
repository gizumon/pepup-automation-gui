import ConfigService from '../../services/configService';

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
    it('Loging ID should be test_id.', () => {
        expect(test1.getLoginId()).toBe('test_id');
    });
    it('Password should be test_id.', () => {
        expect(test1.getPassword()).toBe('test_password');
    });
    it('From date should be custom date object.', () => {
        expect(test1.getFromDate()).toBe({
            date: new Date('2020-01-01'),
            str: {
                date: '2020-01-01',
                year: 2020,
                month: 0,
                day: 0
            }
        });
    });
    it('From date should be custom date object.', () => {
        expect(test1.getToDate()).toBe({
            date: new Date('2020-01-02'),
            str: {
                date: '2020-01-02',
                year: 2020,
                month: 0,
                day: 1
            }
        });
    });
    it('Steps range should be {from: 8000, to: 12000}.', () => {
        expect(test1.getStepRange()).toBe({from: 8000, to: 12000});
    });
    it('Env.name should be pepup automation GUI.', () => {
        expect(test1.getEnv().name).toBe('pepup automation GUI');
    });
});