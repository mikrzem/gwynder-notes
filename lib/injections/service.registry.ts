import {BaseService} from '../base/service';
import {NoteService} from '../notes/service';
import {PagingService} from '../utils/paging.service';
import {Registry} from './registry';
import {RepositoryRegistry} from './repository.registry';

export class ServiceRegistry extends Registry<BaseService> {

    public readonly paging: PagingService;

    public readonly notes: NoteService;

    constructor(
        private readonly repositories: RepositoryRegistry
    ) {
        super();
        this.paging = this.add(new PagingService());
        this.notes = this.add(new NoteService(repositories.noteRepository, this.paging));
    }

}