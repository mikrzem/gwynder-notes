import {RouterBuilder} from '../routing/router';
import {ServiceRegistry} from './service.registry';
import {Registry} from './registry';
import {Application} from 'express';

export class RouterRegistry extends Registry {

    private readonly routerBuilders: RouterBuilder[] = [];

    constructor(
       private readonly services: ServiceRegistry
    ) {
        super();
    }

    public createRoutes(app: Application) {
        this.routerBuilders.forEach(builder => app.use(builder.router));
    }
}