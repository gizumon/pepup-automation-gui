/**
 * Initialize form inputs
 */
window.onload = function () {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const firstDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    firstDay.setDate(1);
    $('#dateFrom').val(dateToHtml(firstDay));
    $('#dateTo').val(dateToHtml(today));
}

/**
 * Post api request
 */
function regist() {
    onLoading();
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
            console.log('Resigt success:', data);
            $('#modalSuccess').modal('show');
            offLoading();
        }).fail((err) => {
            console.log('Regist failed:', err);
            $('#modalFailed').modal('show');
            offLoading();
        });
        console.log('success');
    } else {
        errorArr.forEach((msg) => {
            errorMsgEl.append(createMsgEl(msg));            
        });
        errorMsgEl.removeClass("hidden");
        offLoading();
    }
}

/**
 * Validate request object
 * @param {*} obj 
 */
function validate(obj) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const minSteps = 0;
    const maxSteps = 20000;
    const minDate = 60 * (1000 * 60 * 60 * 24);
    // convert date string
    const dateFrom = new Date(obj.date.from);
    const dateTo = new Date(obj.date.to);
    let errorArr = [];
    // All inputs
    if (!obj.loginId ||
        !obj.password ||
        !obj.date ||
        !obj.date.from ||
        !obj.date.to ||
        !obj.stepsRange ||
        !obj.stepsRange.from ||
        !obj.stepsRange.to
    ) {
        errorArr.push("なんか入力忘れてます、たぶん");
    }
    // Validate for Date
    console.log(today.getTime() - dateFrom.getTime(), minDate);
    console.log(today.getTime() - dateTo.getTime(), minDate);
    if (today.getTime() - dateFrom.getTime() > minDate ||
        today.getTime() - dateTo.getTime() > minDate
    ) {
        errorArr.push(`登録日付は過去2ヵ月以内でたのんます。。`);
    }
    if (today.getTime() - dateFrom.getTime() < 0 ||
        today.getTime() - dateTo.getTime() < 0
    ) {
        errorArr.push(`未来の日付は登録だめ`);
    }
    if (dateFrom.getTime() > dateTo.getTime()) {
        errorArr.push(`日付の範囲あやしいかも`);
    }
    // validate for Steps
    if (obj.stepsRange.from < minSteps ||
        obj.stepsRange.from > maxSteps ||
        obj.stepsRange.to < minSteps ||
        obj.stepsRange.to > maxSteps
    ) {
        errorArr.push(`歩数の入力欄が怪しいかも ( ${minSteps}~${maxSteps} )`);
    }
    if (obj.stepsRange.from >= obj.stepsRange.to) {
        errorArr.push(`歩数の範囲おかしいかも`);
    }
    return errorArr;
}

/**
 * Conver date object to date string 
 * @param {Date} dateObj 
 */
function dateToHtml(dateObj) {
    const thisYear = dateObj.getFullYear(); 
    const thisMonth = ('00' + (dateObj.getMonth() + 1)).slice(-2);
    const thisDay = ('00' + dateObj.getDate()).slice(-2);
    return thisYear + '-' + thisMonth + '-' + thisDay;
}

/**
 * Create message element
 * @param {string} msg 
 */
function createMsgEl(msg) {
    const el = document.createElement('li');
    el.innerHTML = msg;
    return el;
}

function onLoading() {
    $('#loading').removeClass('hidden');
    $('#registBtn').addClass('hidden');
    $('#modalLoading').modal('show');
}

function offLoading() {
    $('#loading').addClass('hidden');
    $('#registBtn').removeClass('hidden');
    setTimeout(function() {
        $('#modalLoading').modal('hide');
    }, 1000);
}