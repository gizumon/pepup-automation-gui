import Koa from "koa";
import Router from "koa-router";
import favicon from "koa-favicon";

import logger from "koa-logger";
import json from "koa-json";

import bodyParser from "koa-bodyparser";
import { config } from "node-config-ts";

import Senario from './cases/scenario';
import ValidationService from './services/validationService';

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
    const data = ctx.request.body;
    const [isValid, validMsg] = validation.validateRequest(data);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = {'message': validMsg};
        return await next();
    }

    const senario = new Senario(data);
    const [isSuccess, registMsg] = await senario.registAll();

    if (!isSuccess) {
        ctx.status = 500;
        ctx.body = {'message': registMsg};
        return await next();
    };
    ctx.status = 200;
    ctx.body = {'message': 'success!'};
    await next();
});

app.listen( PORT, () => console.log( `Server started: ${PORT}` ) );
