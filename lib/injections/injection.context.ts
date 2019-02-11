import {Database} from '../datastore/database';
import {RepositoryRegistry} from './repository.registry';
import {RouterRegistry} from './router.registry';
import {ServiceRegistry} from './service.registry';
import {Application} from 'express';

export class InjectionContext {

    private readonly database: Database = new Database();
    private readonly repositories: RepositoryRegistry = new RepositoryRegistry(this.database);
    private readonly services: ServiceRegistry = new ServiceRegistry(this.repositories);
    private readonly routes: RouterRegistry = new RouterRegistry(this.services);

    public async initialize(app: Application) {
        await this.database.initialize();
        await this.repositories.initialize();
        await this.services.initialize();
        await this.routes.initialize();
        this.routes.createRoutes(app);
    }

    public async close() {
        await this.database.close();
    }

}