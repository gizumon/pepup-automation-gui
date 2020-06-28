import Scenario from '../../cases/scenario';
import moment from 'moment';

const config1 = {
    loginId: "a.g0430t.s@gmail.com",
    password: "nara8739",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

// const main = async function(config1: IRegistRequestConfig) {
//     const test1 = new Scenario(config1);
//     await test1.login();
//     await test1.captureAll(moment.utc(config1.date.from), moment.utc(config1.date.to));    
// }

describe('Senario service', () => {
    const test1 = new Scenario(config1);
    // it('CASE1: Regist all should be success', () => {
    //     expect(test1.registAll());
    // });
    it('CASE2: Capture all should be success', async () => {
        await test1.login();
        await test1.captureAll(moment.utc(config1.date.from), moment.utc(config1.date.to));
        expect(true).toBe(true);
    });
});
