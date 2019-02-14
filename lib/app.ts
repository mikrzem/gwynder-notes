import * as bodyParser from 'body-parser';
import * as express from 'express';
import {baseLogger} from './base/logging';
import {InjectionContext} from './injections/injection.context';

class Application {

    public app: express.Application;

    public readonly context: InjectionContext = new InjectionContext();

    private readonly logger = baseLogger.child({name: 'Application'});

    constructor() {
        this.app = express();
        this.config();
    }

    public async start() {
        try {
            await this.context.initialize(this.app);
            this.app.listen(3000, () => this.logger.info('Application started'));
        } catch (error) {
            this.logger.error('Error during startup', {error: error});
        }
    }

    public async stop() {
        await this.context.close();
    }

    private config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }
}

export const application = new Application();