export default class UtilityFunctions {
    constructor() {}

    /**
     * Get the number of months between day1 and day2
     * @param day1 
     * @param day2
     * @return number
     */
    // static monthDiff(day1: Date, day2: Date): number {
    //     let months;
    //     months = (day2.getFullYear() - day1.getFullYear()) * 12;
    //     months -= day1.getMonth() + 1;
    //     months += day2.getMonth();
    //     return months <= 0 ? 0 : months;
    // }

    /**
     * Get random integer between min and max
     * @param min specified min integer
     * @param max specified max integer
     * @return number
     */
    static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Get date as specified format
     * @return string
     */
    static getFormattedDate = function(date: Date, format: string = 'yyyy-mm-ddT00:00:00.000Z'): string {
        const yCount = this.countStr('y', format);
        const mCount = this.countStr('m', format);
        const dCount = this.countStr('d', format);
        const year = this.zeroPadding(date.getFullYear(), yCount);
        const month = this.zeroPadding(date.getMonth() + 1, mCount);
        const day = this.zeroPadding(date.getDate(), dCount);
        return format.replace('y'.repeat(yCount), year).replace('m'.repeat(mCount), month).replace('d'.repeat(dCount), day);
    }

    /**
     * Padding zero as specified length
     * @param num
     * @param length
     * @return string
     */
    static zeroPadding = function(num:number, length: number): string {
        return ('000000000000000' + num).slice(-length);
    };

    static countStr(searchStr: string, targetStr: string): number {
        const regexp = new RegExp(searchStr, 'ig');
        const matches = targetStr.match(regexp) || [];
        return matches.length;
    }
}
