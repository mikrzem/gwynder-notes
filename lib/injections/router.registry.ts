import {RouterBuilder} from '../routing/router';
import {ServiceRegistry} from './service.registry';
import {Registry} from './registry';
import {Application} from 'express';

export class RouterRegistry extends Registry<RouterBuilder> {

    constructor(
        private readonly services: ServiceRegistry
    ) {
        super();
    }

    public createRoutes(app: Application) {
        this.all.forEach(builder => app.use(builder.rootPath, builder.router));
    }
}