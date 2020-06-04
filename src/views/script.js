window.onload = function () {
    const today = new Date();
    const firstDay = new Date();
    firstDay.setDate(1);
    $('#dateFrom').val(dateToHtml(firstDay));
    $('#dateTo').val(dateToHtml(today));
}

function regist() {
    const obj = {
        'loginId': $('#loginId').val(),
        'password': $('#password').val(),
        // 'sessionId': document.getElementById('sessionId').value,
        'date': {
            'from': $('#dateFrom').val(), 
            'to': $('#dateTo').val()
        },
        'stepsRange': {
            'from': Number($('#stepsFrom').val()),
            'to': Number($('#stepsTo').val())
        }
    };
    const errorArr = validate(obj);
    const errorMsgEl = $('#errorMsg');
    errorMsgEl.addClass('hidden').empty();
    if (errorArr.length === 0) {
        // google.script.run.withSuccessHandler(onSuccess).regist(JSON.stringify(obj));
        $.post('./regist', obj).done((data) => {
            console.log('data', data);
        });
        console.log('success');
    } else {
        errorArr.forEach((msg) => {
            errorMsgEl.append(createMsgEl(msg));            
        });
        errorMsgEl.removeClass("hidden");
    }
}

function validate(obj) {
    const today = new Date();
    const minSteps = 0;
    const maxSteps = 20000;
    // convert date string
    const dateFrom = new Date(obj.date.from);
    const dateTo = new Date(obj.date.to);
    let errorArr = [];
    // All inputs
    if (!(obj.loginId && obj.password && obj.date.from && obj.date.to && obj.stepsRange.from && obj.stepsRange.to)) {
        errorArr.push("未入力欄がないか確認してください");
    }
    // Validate for Date
    if (dateFrom.getTime() >= today.getTime() || dateTo.getTime() >= today.getTime()) {
        errorArr.push(`日付に現在時刻より先の日付が指定されています`);
    }
    if (dateFrom.getTime() >= dateTo.getTime()) {
        errorArr.push(`日付の左側の入力欄が右側より小さい値になっているか確認してください`);
    }
    // validate for Steps
    if (obj.stepsRange.from < minSteps || obj.stepsRange.from > maxSteps ||
        obj.stepsRange.to < minSteps || obj.stepsRange.to > maxSteps) {
        errorArr.push(`歩数の入力欄の値が正しいか確認してください ( ${minSteps}~${maxSteps} )`);
    }
    if (obj.stepsRange.from >= obj.stepsRange.to) {
        errorArr.push(`歩数の左側の入力欄が右側より小さい値になっているか確認してください`);
    }
    return errorArr;
}

function dateToHtml(dateObj) {
    const thisYear = dateObj.getFullYear(); 
    const thisMonth = ('00' + (dateObj.getMonth() + 1)).slice(-2);
    const thisDay = ('00' + dateObj.getDate()).slice(-2);
    console.log(thisYear, thisMonth, thisDay);
    return thisYear + '-' + thisMonth + '-' + thisDay;
}

function createMsgEl(msg) {
    const el = document.createElement('li');
    el.innerHTML = msg;
    return el;
}