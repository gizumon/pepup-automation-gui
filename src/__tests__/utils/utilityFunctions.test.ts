import utils from '../../utils/utilityFunctions';

// Invalid steps type
const case13 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
    stepsRange: {
        from: "invalid",
        to: "invalid"
    }
};

// describe('Test for the month diff functions', () => {
//     it('CASE1: month diff = 0', () => {
//         expect(utils.monthDiff(new Date('2020-01-01'), new Date('2020-01-01'))).toBe(0);
//     });
//     it('CASE2: month diff = 1', () => {
//         expect(utils.monthDiff(new Date('2020-01-01'), new Date('2020-02-28'))).toBe(1);
//     });
//     it('CASE1: month diff = 12', () => {
//         expect(utils.monthDiff(new Date('2020-01-01'), new Date('2021-02-01'))).toBe(12);
//     });
// });

describe('Test for get formatted date functions', () => {
    it('CASE1: Normal case', () => {
        expect(utils.getFormattedDate(new Date('2020-01-01'), 'yyyy-mm-ddT00:00:00.000Z')).toBe('2020-01-01T00:00:00.000Z');
    });
    it('CASE2: Default format case', () => {
        expect(utils.getFormattedDate(new Date('2020-01-01'))).toBe('2020-01-01T00:00:00.000Z');
    });
    it('CASE3: Zero padding', () => {
        expect(utils.zeroPadding(1, 2)).toBe('01');
    });
});

describe('Test for zero padding', () => {
    it('CASE1: One-digit to Two-digit number', () => {
        expect(utils.zeroPadding(1, 2)).toBe('01');
    });
    it('CASE2: Two-digit to Two-digit number', () => {
        expect(utils.zeroPadding(11, 2)).toBe('11');
    });
    it('CASE3: Three-digit to Two-digit number', () => {
        expect(utils.zeroPadding(111, 2)).toBe('11');
    });
});

describe('Test for count specific string in some sentence', () => {
    it('CASE1: Find 0', () => {
        expect(utils.countStr('abc', 'aaa')).toBe(0);
    });
    it('CASE2: Find 1', () => {
        expect(utils.countStr('abc', 'abc')).toBe(1);
    });
    it('CASE3: Find 2', () => {
        expect(utils.countStr('abc', 'abcabc')).toBe(2);
    });
    it('CASE4: Find 2', () => {
        expect(utils.countStr('abc', 'basaabcaweabcsadaf')).toBe(2);
    });
});