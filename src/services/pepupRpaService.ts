import puppeteer from 'puppeteer';
import moment from 'moment';
import ConfigService, { IRegistRequestConfig } from './configService';

export default class PepupRpaService {
    private url: string;
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;
    private configService: ConfigService;

    constructor (configService: ConfigService) {
        this.configService = configService;
    }

    async initialize() {
        this.url = this.configService.getEnv().pepup.url.page;
        this.browser = await puppeteer.launch({ headless: this.configService.getEnv().pepup.configs.isHeadless});
        this.page = await this.browser.newPage();
        this.page.setViewport({width: 1200, height: 800});
    }

    async login(user: string, password: string) {
        await this.page.goto(this.url, {waitUntil: "domcontentloaded"});
        await this.page.type('#sender-email', user);
        await this.page.type('#user-pass', password);
        await this.page.click('input[name="commit"]');
        await this.page.waitForNavigation({timeout: 10000, waitUntil: 'networkidle2'});
    }

    async isLogin() {
        const url = await this.page.url();
        return (url === 'https://pepup.life/home' || url === 'https://pepup.life/scsk_mileage_campaigns');
    }

    async getSettionId() {
        const cookies = await this.page.cookies();
        return cookies.filter((obj) => obj.name === 'pepup_sess')[0].value;
    }

    async registAll(fromDate: moment.Moment, toDate: moment.Moment) {
        let errCnt = 0;
        const errLimit = this.configService.getEnv().pepup.configs.errorLimit;
        
        // initialize a regist date and last date object
        let targetDate = moment(fromDate);

        // roop if regist date is smaller than lastDateObj.date
        while (targetDate.isSameOrBefore(toDate)) {
            const endDate = moment(targetDate).endOf('month').isBefore(toDate) ? moment(fromDate).endOf('month'): toDate;
            console.log(targetDate, endDate);
            try {
                await this.clickCalendars(targetDate, endDate);
            } catch (e) {
                console.error(`ERROR::[Failed] regist at ${targetDate.toLocaleString()}::[Error count]${errCnt}::[Message]${e}`);
                errCnt++;
            }

            if (errCnt >= errLimit) {
                throw new Error(`[Message]Errors are over the number of limit::[date]Break at ${targetDate.toLocaleString()}`);
                break;
            }

            // Update regist date as the first day of the next month
            targetDate.add(1, 'month').startOf('month');
        }
    }

    private async clickCalendars (fromDate: moment.Moment, toDate: moment.Moment) {
        // NOTE: month is started from 0
        const url = this.url + '/' + fromDate.year() + '/' + (fromDate.month() + 1);
        // selectors
        const cardSelector = '.afxg5u-0';
        const cartTitleSelector = '.afxg5u-1';
        const registBtnSelector = '.sc-1ccba62-8 button';

        await this.page.goto(url, {waitUntil: 'networkidle2'});
        const $cards = await this.page.$$(cardSelector);
        for (let i=0; i < $cards.length; i++) {
            if (i < 2) { continue; } // card1 and 2 are registed from api
            const $card = $cards[i];
            console.log('card', (await (await $card.$(cartTitleSelector)).getProperty('textContent')).jsonValue());
            
            const $btns = await $card.$$(registBtnSelector);
            for (let i=0; i < $btns.length; i++) {
                // $btns.some(async ($btn) => {
                const $btn = $btns[i];
                console.log('btn', (await $btn.getProperty('textContent')).jsonValue());
                const btnDay = Number(await (await $btn.getProperty('textContent')).jsonValue());
                const btnDate = moment(fromDate).date(btnDay);
                console.log('btn day', btnDay, btnDate);
                // Continue if btn day is not a number OR btn date is smaller than target date
                if (btnDay === NaN ||
                    btnDay === 0 ||
                    !btnDate.isValid() ||
                    btnDate.isBefore(fromDate)
                ) { continue; }
                // Break if btn date is begger than to date
                if (btnDate.isAfter(toDate)) { break; }
                await $btn.click();
                await this.checkModal();
            };
        };
    }

    private async checkModal() {
        // const modalSelector = '.ycydyz-0';
        const labelsSelector = '.ycydyz-0 label';
        const closeSelector = '.ycydyz-0 button';

        const $labels = await this.page.$$(labelsSelector);
        for (let i=0; i < $labels.length; i++) {
            const $label = $labels[i];
            const text = await (await $label.getProperty('textContent')).jsonValue();
            console.log('label', text);
            const $checkBox = await $label.$('input');
            const checked = await (await $checkBox.getProperty('checked')).jsonValue();
            console.log(checked);
            if (!checked) {
                $checkBox.click();
            }
        };
        await (await this.page.$(closeSelector)).click();
    }

    public async captureResult(url: string, name: string) {
        await this.page.goto(url, {waitUntil: "networkidle2"});
        await this.page.screenshot({path: `./src/views/storage/${name}.png`, fullPage: true});
    }

    public async closeBrowser() {
        await this.browser.close();
    }
}
