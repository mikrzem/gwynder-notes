import {Application} from 'express';
import {RouterBuilder} from '../base/router';
import {DashboardRouter} from '../central/dashboard';
import {HealthRouter} from '../central/health';
import {NoteRouter} from '../notes/router';
import {Registry} from './registry';
import {ServiceRegistry} from './service.registry';

export class RouterRegistry extends Registry<RouterBuilder> {

    public readonly notes: NoteRouter;

    public readonly dashboard: DashboardRouter;

    public readonly health: HealthRouter;

    constructor(
        private readonly services: ServiceRegistry
    ) {
        super();

        this.notes = this.add(new NoteRouter(services.notes, services.paging));
        this.dashboard = this.add(new DashboardRouter(services.notes));
        this.health = this.add(new HealthRouter());
    }

    public createRoutes(app: Application) {
        this.all.forEach(builder => app.use(builder.rootPath, builder.router));
    }
}