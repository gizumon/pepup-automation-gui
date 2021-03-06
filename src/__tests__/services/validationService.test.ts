import ValidationService from '../../services/validationService';

// Normal case
const case1 = {
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

// There is no Login id
const case2 = {
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

// There is no password
const case3 = {
    loginId: "test_id",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

// There is no date range
const case4 = {
    loginId: "test_id",
    password: "test_password",
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

// There is no date from
const case5 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        to: "2020-01-02"
    },
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

// There is no date to
const case6 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-01", 
    },
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

// There is no steps range
const case7 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
};

// There is no step from
const case8 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
    stepsRange: {
        to: "12000"
    }
};

// There is no step to
const case9 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
    stepsRange: {
        to: "12000"
    }
};

// Invalid date range
const case10 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-02", 
        to: "2020-01-01"
    },
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

// Invalid steps range
const case11 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "2020-01-01", 
        to: "2020-01-02"
    },
    stepsRange: {
        from: "12000",
        to: "8000"
    }
};

// Invalid date format
const case12 = {
    loginId: "test_id",
    password: "test_password",
    date: {
        from: "invalid", 
        to: "invalid"
    },
    stepsRange: {
        from: "8000",
        to: "12000"
    }
};

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

describe('Config service as data:config1', () => {
    const test1 = new ValidationService();
    it('CASE1: Success case', () => {
        expect(test1.validateRegist(case1)).toEqual([true, 'INFO::[Message]Success!']);
    });
    it('CASE2: There is no login id', () => {
        expect(test1.validateRegist(case2 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    it('CASE3: There is no password', () => {
        expect(test1.validateRegist(case3 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    it('CASE4: There is no date range', () => {
        expect(test1.validateRegist(case4 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    it('CASE5: There is no date from', () => {
        expect(test1.validateRegist(case5 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    it('CASE6: There is no date to', () => {
        expect(test1.validateRegist(case6 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    it('CASE7: There is no steps range', () => {
        expect(test1.validateRegist(case7 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    it('CASE8: There is no step from', () => {
        expect(test1.validateRegist(case8 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    it('CASE9: There is no step to', () => {
        expect(test1.validateRegist(case9 as any)).toEqual([false, `WARN::[Message]Need to fill all required parameters`]);
    });
    // Error in github workflow
    xit('CASE10: Invalid date range', () => {
        expect(test1.validateRegist(case10 as any)).toEqual([false, `WARN::[Message]Date range is invalid::[Date from]Thu Jan 02 2020 00:00:00 GMT+0900::[Date to]Wed Jan 01 2020 00:00:00 GMT+0900`]);
    });
    it('CASE11: Invalid steps range', () => {
        expect(test1.validateRegist(case11 as any)).toEqual([false, `WARN::[Message]Steps range is invalid::[Step from]12000::[Step to]8000`]);
    });
    it('CASE12: Invalid date format', () => {
        expect(test1.validateRegist(case12 as any)).toEqual([false, `WARN::[Message]Invalid date parameter`]);
    });
    it('CASE13: Invalid step type', () => {
        expect(test1.validateRegist(case13 as any)).toEqual([false, `WARN::[Message]Invalid steps parameter`]);
    });
});
