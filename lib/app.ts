import * as bodyParser from 'body-parser';
import * as express from 'express';
import {InjectionContext} from './injections/injection.context';

class Application {

    public app: express.Application;

    public readonly context: InjectionContext = new InjectionContext();

    constructor() {
        this.app = express();
        this.config();
    }

    public async start() {
        await this.context.initialize(this.app);
        this.app.listen(3000, () => console.log('Application started'));
    }

    private config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

    public async stop() {
        await this.context.close();
    }
}

export const application = new Application();