import puppeteer from 'puppeteer';
import ConfigService, { IRegistRequestConfig, IDateObject } from './configService';

export default class PepupRpaService {
    private url: string;
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;
    private configService: ConfigService;

    constructor (configService: ConfigService) {
        this.configService = configService;
        this.initialize();
    }

    async initialize() {
        this.url = this.configService.getEnv().pepup.url.page;
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
    }

    async login(user: string, password: string) {
        await this.page.goto(this.url, {waitUntil: "domcontentloaded"});
        await this.page.type('#sender-email', user);
        await this.page.type('#user-pass', password);
        await this.page.click('input[name="commit"]');
        await this.page.waitForNavigation({timeout: 20000, waitUntil: 'domcontentloaded'});
    }

    async isLogin() {
        const url = await this.page.url();
        return url === 'https://pepup.life/home';
        // const title = await this.page.title();
        // return title === 'ホーム - Pep Up(ペップアップ)';
        // const cookies = await this.page.cookies();
        // return cookies.some((obj) => obj.name === 'imid');
        // return this.page.$eval('input[name="commit"]', el => el.val === 'ログイン');
    }

    async getSettionId() {
        const cookies = await this.page.cookies();
        return cookies.filter((obj) => obj.name === 'pepup_sess')[0].value;
    }

    async registAll(fromDateObj: IDateObject, toDateObj: IDateObject) {
        let errCnt = 0;
        const errLimit = this.configService.getEnv().pepup.configs.errorLimit;
        
        // initialize a regist date and last date object
        let registDateObj = fromDateObj;
        const endDateObj = this.configService.createDateObj(new Date(registDateObj.str.year, registDateObj.str.month + 1, 0));

        // roop if regist date is smaller than lastDateObj.date
        while (registDateObj.date <= endDateObj.date && errCnt < errLimit ) {
            const dateObj = endDateObj.date > toDateObj.date ? toDateObj: endDateObj;
            try {
                await this.clickCalendars(registDateObj, dateObj);
            } catch (e) {
                console.error(`ERROR::[Failed] regist at ${registDateObj.str.date}::[Error count]${errCnt}::[Message]${e}`);
                errCnt++;
            }

            // Update regist date as the first day of the next month
            registDateObj = this.configService.createDateObj(new Date(registDateObj.str.year, registDateObj.str.month + 1, 1));
        }

        if (errCnt > errLimit) {
            return Promise.reject();
        }
    }

    private async clickCalendars (fromDateObj: IDateObject, toDateObj: IDateObject) {
        const url = this.url + '/' + fromDateObj.str.year + '/' + ('00' + fromDateObj.str.month).slice(-2);
        // selectors
        const cardSelector = '.afxg5u-0';
        const cartTitleSelector = '.afxg5u-1';
        const registBtnSelector = '.sc-1ccba62-8 button';

        await this.page.goto(url, {waitUntil: "domcontentloaded"});
        const $cards = await this.page.$$(cardSelector);
        $cards.some(async ($card, index) => {
            if (index <= 2) { return; } // card1 and 2 are registed from api
            const $btns = await this.page.$$(registBtnSelector);
            $btns.some(async ($btn) => {
                const btnDay = Number(await (await $btn.getProperty('textContent')).jsonValue());
                const btnDate = new Date(fromDateObj.str.year, fromDateObj.str.month, btnDay);
                // Continue if btn day is not a number OR btn date is smaller than target date
                if (btnDay === NaN ||
                    btnDay === 0 ||
                    btnDate.toString() === 'Invalid Date' ||
                    btnDate < fromDateObj.date
                ) { return; }
                // Break if btn date is begger than to date
                if (btnDate > toDateObj.date) { return true; }
                await $btn.click();
                await this.checkModal();
            });
        });
        this.captureResult(url, `${fromDateObj.str.date}_${toDateObj.str.date}`);
    }

    private async checkModal() {
        // const modalSelector = '.ycydyz-0';
        const labelsSelector = '.ycydyz-0 label';
        const closeSelector = '.ycydyz-0 button';

        const $labels = await this.page.$$(labelsSelector);
        $labels.some(async ($label) => {
            const text = await (await $label.getProperty('textContent')).jsonValue();
            const $checkBox = await $label.$('input');
            const checked = await (await $checkBox.getProperty('checked')).jsonValue();
            if (!checked) {
                $checkBox.click();
            }
        });
        await (await this.page.$(closeSelector)).click();
    }

    private async captureResult(url: string, name: string) {
        await this.page.goto(url, {waitUntil: "domcontentloaded"});
        await this.page.screenshot({path: `../asset/storage/${name}.png`});
    }
}
