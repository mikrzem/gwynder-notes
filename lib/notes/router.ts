import {ResponseCreatorParams, RouterBuilder} from '../base/router';
import {NoteService} from './service';

export class NoteRouter extends RouterBuilder {

    constructor(
        private readonly service: NoteService
    ) {
        super();
    }

    get rootPath() {
        return '/api/notes/notes';
    }

    protected initializeRoutes() {
        this.get(
            '/',
            params => this.service.selectAll(params.owner)
        );
        this.get(
            '/:id',
            params => this.service.get(
                this.getId(params),
                params.owner
            )
        );
        this.post(
            '/',
            params => this.service.create(
                params.request.body,
                params.owner
            )
        );
        this.put(
            '/:id',
            params => this.service.update(
                params.request.body,
                this.getId(params),
                params.owner
            )
        );
        this.delete(
            '/:id',
            params => this.service.delete(
                this.getId(params),
                params.owner
            )
        );
    }

    private getId(params: ResponseCreatorParams) {
        return parseInt(params.request.params['id'], 10);
    }
}