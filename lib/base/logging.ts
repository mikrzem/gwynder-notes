import * as winston from 'winston';

export const baseLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD[T]HH:mm:ss'
        }),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console()
    ]
});