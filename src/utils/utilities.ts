let utils = function() {};

utils.prototype.monthDiff = function(d1: Date, d2: Date): number {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

utils.prototype.getRandomInt = function(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

utils.prototype.getFormattedDate = function(date: Date, format: string = 'yyyy-mm-dd') {
    const year = String(date.getFullYear());
    const month = String(date.getMonth());
    const day = String(date.getDate());
    return format.replace('yyyy', year).replace('mm', month).replace('dd', day);
}

module.exports = utils;