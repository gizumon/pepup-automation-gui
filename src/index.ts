import Koa from "koa";
import Router from "koa-router";
import favicon from "koa-favicon";

import logger from "koa-logger";
import json from "koa-json";

import bodyParser from "koa-bodyparser";
import { config } from "node-config-ts";

import PepupScenario from './cases/pepupScenario';
import ScrapingScenario from './cases/scrapingScenario';

import ValidationService from './services/validationService';
import { IRegistRequestConfig, IScrapingBulkRequestConfig, IScrapingRequestConfig } from "./services/configService";

const serve = require('koa-static');
const path = require('path');
const validation = new ValidationService();

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || config.service.port;


/** Middlewares */
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(serve(`${__dirname}/views`));

/** Routes */
app.use( router.routes() ).use( router.allowedMethods() );

router.post( '/regist', async (ctx: Koa.Context, next: () => Promise<any>) => {
    console.log(`INFO::[URL]Request /regist::[Message]Start`);
    const data: IRegistRequestConfig = ctx.request.body;
    const [isValid, validMsg] = validation.validateRegist(data);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = {'message': validMsg};
        return await next();
    }
    console.log(`INFO::[ID]${data.loginId}::[Message]Start regist`);

    const pepupScenario = new PepupScenario(data);
    const [isSuccess, registMsg] = await pepupScenario.registAll();

    if (!isSuccess) {
        ctx.status = 500;
        ctx.body = {'message': registMsg};
        return await next();
    };
    ctx.status = 200;
    ctx.body = {'message': 'success!'};
    await next();
});

router.get('/scraping', async (ctx: Koa.Context, next: () => Promise<any>) => {
    let isSuccess, result;
    console.log(`INFO::[URL]Request /scraping::[Message]Start`,ctx.request.querystring);
    if (!ctx.request.query.url) {
        ctx.status = 400;
        ctx.body = {
            'message': 'Please input url parmaeter',
            'params': ctx.request.query
        };
        return await next();
    }
    const data: IScrapingRequestConfig = {
        url: ctx.request.querystring
             .match(/^url=.*&cssSelector|^url=.*&xPathSelector|&?url=(?!.*(cssSelector|xPathSelector)).*$/)[0]
             .replace(/&cssSelector/, '')
             .replace(/&xPathSelector/, '')
             .replace(/&?url=/, '')
             .replace(/.*&$/, ''),
        cssSelector: ctx.request.query?.cssSelector,
        xPathSelector: ctx.request.query?.xPathSelector
    };
    console.log(`INFO::[URL]/scraping::[RequestBody]::${JSON.stringify(data)}`);
    const [isValid, validMsg] = validation.validateScraping(data);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = {'message': validMsg};
        return await next();
    }

    const scrapingScenario = new ScrapingScenario();
    try {
        [isSuccess, result] = await scrapingScenario.getOne(data);
    } catch (e) {
        ctx.status = 500;
        ctx.body = {'message': e};
        return await next();
    }

    if (!isSuccess) {
        ctx.status = 500;
        ctx.body = {'message': result};
        return await next();
    };
    ctx.status = 200;
    ctx.body = result;
    await next();
});

router.post('/scraping/bulk', async (ctx: Koa.Context, next: () => Promise<any>) => {
    let isSuccess, result;
    console.log(`INFO::[URL]Request /scraping::[Message]Start`);
    const data: IScrapingBulkRequestConfig = ctx.request.body;
    console.log(`INFO::[RequestBody]`,data);
    const [isValid, validMsg] = validation.validateBulkScraping(data);
    console.log(validMsg);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = {'message': validMsg};
        return await next();
    }

    const scrapingScenario = new ScrapingScenario();
    try {
        [isSuccess, result] = await scrapingScenario.getBulk(data);
    } catch (e) {
        ctx.status = 500;
        ctx.body = {'message': e};
        return await next();
    }

    if (!isSuccess) {
        ctx.status = 500;
        ctx.body = {'message': result};
        return await next();
    };
    ctx.status = 200;
    ctx.body = result;
    await next();
});

app.listen( PORT, () => console.log( `Server started: ${PORT}` ) );
