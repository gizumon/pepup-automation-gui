import Koa from "koa";
import Router from "koa-router";

import logger from "koa-logger";
import json from "koa-json";

import bodyParser from "koa-bodyparser";
import { config } from "node-config-ts";

import Senario from './cases/scenario';
import ValidationService from './services/validationService';

const render = require('koa-ejs');
const path = require('path');
const validation = new ValidationService();

const app = new Koa();
const router = new Router();
const PORT = config.service.port;

/** Middlewares */
app.use(json());
app.use(logger());
app.use(bodyParser());

/** Routes */
app.use( router.routes() ).use( router.allowedMethods() );

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
});

// app.use(async function (ctx) {
//     await ctx.render('index');
// });

router.get('/', async (ctx: Koa.Context, next: () => Promise<any>) => {
    await ctx.render('index');
    await next();
});

router.post( '/regist', async (ctx: Koa.Context, next: () => Promise<any>) => {
    console.log('ctx',ctx);
    const data = ctx.request.body;
    console.log(data);
    const isValid = validation.validateRequest(data);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = 'Please check request parameters...'
        return await next();
    }

    const senario = new Senario(data);
    const isSuccess = await senario.registAll();
    if (!isSuccess) {
        ctx.status = 500;
        ctx.body = 'Failed regist...'
        return await next();
    };
    ctx.status = 200;
    await next();
});

app.listen( PORT, () => console.log( `Server started: ${PORT}` ) );
