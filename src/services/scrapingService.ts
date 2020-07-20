import puppeteer from 'puppeteer';
import {config as c} from 'node-config-ts';

export default class ScrapingService {
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;

    constructor () {}

    async initialize() {
        console.log(`Launch browser Headless mode is : ${c.pepup.configs.isHeadless}`);
        this.browser = await puppeteer.launch({
            headless: c.pepup.configs.isHeadless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        this.page = await this.browser.newPage();
        this.page.setViewport({width: 1200, height: 800});
    }

    async access(url: string) {
        try {
            await this.page.goto(url, {waitUntil: "networkidle2"});
        } catch (e) {
            this.closeBrowser();
            console.error(`ERROR::[Message]Failed to access::[URL]${url}::[Error]`, e);
            throw new Error(`ERROR::[Message]Failed to access::[URL]${url}::[Error]${e}`);
        }
    }

    async getElementsByCssSelector(selector: string): Promise<puppeteer.ElementHandle<Element>> {
        await this.page.waitForSelector(selector);
        return await this.page.$(selector).catch((e) => {
            this.closeBrowser();
            console.error(`ERROR::[Message]Failed to get content by css selector::[Selector]${JSON.stringify(selector)}::[Error]`, e);
            throw new Error(`ERROR::[Message]Failed to get content by css selector::[Selector]${JSON.stringify(selector)}::[Error]${e}`);
        });
    }

    async getContentByCssSelector(selector: string): Promise<string> {
        return String(await (await (await this.getElementsByCssSelector(selector)).getProperty('innerHTML')).jsonValue());
    }

    async getElementsByXpath(selector: string): Promise<puppeteer.ElementHandle<Element>[]> {
        await this.page.waitForXPath(selector);
        return await this.page.$x(selector).catch((e) => {
            this.closeBrowser();
            console.error(`ERROR::[Message]Failed to get content by xpath selector::[Selector]${JSON.stringify(selector)}::[Error]`, e);
            throw new Error(`ERROR::[Message]Failed to get content by xpath selector::[Selector]${JSON.stringify(selector)}::[Error]${e}`);
        });
    }

    async getContentByXpath(selector: string): Promise<string> {
        return String(await (await (await this.getElementsByXpath(selector))[0].getProperty('innerHTML')).jsonValue());
    }

    public async captureResult(url: string, name: string) {
        await this.page.goto(url, {waitUntil: "domcontentloaded"});
        // await this.page.waitForNavigation({timeout: 10000, waitUntil: 'networkidle2'});
        console.log('dirname', __dirname);
        try {
            await this.page.screenshot({path: `${__dirname}/../views/storage/${name}.png`, fullPage: true});
            console.log(`INFO::[Message]Success capture result::[url]::${__dirname}/../views/storage/${name}.png`);
        } catch (e) {
            this.closeBrowser();
            console.warn(`WARN::[Message]${e}`);
        }
    }

    public async closeBrowser() {
        await this.browser.close();
    }
}
