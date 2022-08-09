import chalk from 'chalk';

const isProd = process.argv.includes('-p');

import express from 'express';
import https from 'https';
import MyPageRouter from './routers/MyPageRouter.js';
import UserRouter from './routers/UsersRouter.js';

import fs from 'fs';
import pino from 'pino-http';
import bodyParser from 'body-parser';

export default () => {
    console.log(chalk.cyan('[i]正在启动web服务器'));
    const app = express();
    const port = {
        ssl: 443,
        default: 80,
    };
    const options = {
        key: fs.readFileSync('./src/web/static/www.jerrymc.cn.key'),
        cert: fs.readFileSync('./src/web/static/www.jerrymc.cn.pem'),
    };

    app.use(
        pino({
            stream: fs.createWriteStream(
                './src/log/' + new Date().toString().replace(' ', '_') + '.log',
                'utf-8'
            ),
        })
    );
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/xaml', MyPageRouter);
    app.use('/users', UserRouter);

    if (isProd) {
        var server = https.createServer(options, app);
        server.listen(port.ssl, () => {
            console.log(
                chalk.green(
                    'JMC应用在端口' + typeof server.address() == 'string'
                        ? server.address()
                        : server.address().port + '开启'
                )
            );
        });
    }
    app.listen(port.default, () => {
        console.log(chalk.green('JMC应用在端口' + port.default + '开启'));
    });
};