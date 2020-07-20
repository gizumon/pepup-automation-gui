import ScrapingService from '../services/scrapingService';
import { IScrapingBulkRequestConfig, IScrapingResponseData, IScrapingContent, IScrapingResult, IScrapingRequestConfig } from '../services/configService';
import { config } from 'process';
import { exception } from 'console';
import bodyParser from 'koa-bodyparser';

export default class ScrapingScenario {
    scrapingService: ScrapingService;

    constructor() {
        this.scrapingService = new ScrapingService();
    }

    async getBulk(reqData: IScrapingBulkRequestConfig): Promise<[boolean, IScrapingResponseData]> {
        let isSuccess: boolean = true;
        let message: string;
        let results: IScrapingResult[] = [];

        await this.scrapingService.initialize();
        console.log(`INFO::[Message]Scraping start[Type]${reqData.type}`);
        for (let config of reqData.configs) {
            let contents: IScrapingContent[] = [];
            await this.scrapingService.access(config.url);
            for (let selector of config.selectors) {
                contents.push({
                    id: selector.id,
                    name: selector.name,
                    value: selector.xPathSelector ? await this.scrapingService.getContentByXpath(selector.xPathSelector)
                            : selector.cssSelector ? await this.scrapingService.getContentByCssSelector(selector.cssSelector)
                            : await this.scrapingService.getContentByCssSelector('body')
                });
            }
            results.push({
                id: config.id,
                name: config.name,
                contents: contents
            });
        }

        await this.scrapingService.closeBrowser();
        return [isSuccess, {
            type: reqData.type,
            results: results
        }];
    };

    async getOne(reqData: IScrapingRequestConfig): Promise<[boolean, string]> {
        let isSuccess: boolean = true;

        await this.scrapingService.initialize();
        await this.scrapingService.access(reqData.url);
        const responseData = reqData.xPathSelector ? await this.scrapingService.getContentByXpath(reqData.xPathSelector)
                           : reqData.cssSelector ? await this.scrapingService.getContentByCssSelector(reqData.cssSelector)
                           : await this.scrapingService.getContentByCssSelector('body');
        
        await this.scrapingService.closeBrowser();
        return [isSuccess, `<html><head></head><body>${responseData}</body></html>`];
    };
}