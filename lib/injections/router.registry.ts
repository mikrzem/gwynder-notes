import {Application} from 'express';
import {RouterBuilder} from '../base/router';
import {NoteRouter} from '../notes/router';
import {Registry} from './registry';
import {ServiceRegistry} from './service.registry';

export class RouterRegistry extends Registry<RouterBuilder> {

    public readonly notes: NoteRouter;

    constructor(
        private readonly services: ServiceRegistry
    ) {
        super();

        this.notes = this.add(new NoteRouter(services.notes, services.paging));
    }

    public createRoutes(app: Application) {
        this.all.forEach(builder => app.use(builder.rootPath, builder.router));
    }
}