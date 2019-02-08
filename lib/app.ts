import * as bodyParser from 'body-parser';
import * as express from 'express';
import {Database} from './datastore/database';
import {RepositoryRegistry} from './repository.registry';

class Application {

    public app: express.Application;

    public readonly database: Database;

    public readonly repositoryRegistry: RepositoryRegistry;

    constructor() {
        this.app = express();
        this.config();

        this.database = new Database();
        this.repositoryRegistry = new RepositoryRegistry(this.database);
    }

    public async initialize() {
        await this.database.initialize();
        await this.repositoryRegistry.initialize();
    }

    private config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

}

export const application = new Application();