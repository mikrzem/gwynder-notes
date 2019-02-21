import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import {baseLogger} from './base/logging';
import {StaticFiles} from './hosting/static';
import {InjectionContext} from './injections/injection.context';

class Application {

    public app: express.Application;

    public readonly context: InjectionContext = new InjectionContext();

    private readonly logger = baseLogger.child({name: 'Application'});

    private readonly staticFiles: StaticFiles;

    private readonly port: number = 3000;

    constructor() {
        this.app = express();
        this.staticFiles = new StaticFiles(this.app);
        this.config();
    }

    public async start() {
        try {
            await this.context.initialize(this.app);
            this.app.listen(this.port, () => this.logger.info(`Application started on port ${this.port}`));
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
        this.app.use(cors());
        this.staticFiles.initialize();
    }
}

export const application = new Application();