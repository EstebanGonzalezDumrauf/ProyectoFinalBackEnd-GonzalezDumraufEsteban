import winston from 'winston';
import config from '../config/config.js';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({level: 'debug'}), 
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({level: 'info'}), 
        new winston.transports.File({filename: './errors.log', level: 'error'}) 
    ]
})

const environment = config.environment;
console.log(environment);

export const addLogger = (req, res, next) => {
    if (environment == 'dev') {
        req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    }
    next();
}