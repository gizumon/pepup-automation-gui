import PepupRpaService from '../../services/pepupRpaService';
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

describe('Pepup api functions [standard]', () => {
    const dummyConfigService = new ConfigService(config1);
    const test = new PepupRpaService(dummyConfigService);
    it('CASE1: Do Constructor (initialize)', () => {
        const test1 = new PepupRpaService(dummyConfigService);
    });
});
