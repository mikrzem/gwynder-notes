import {BaseService} from '../base/service';
import {NoteService} from '../notes/service';
import {Registry} from './registry';
import {RepositoryRegistry} from './repository.registry';

export class ServiceRegistry extends Registry<BaseService> {

    public readonly notes: NoteService;

    constructor(
        private readonly repositories: RepositoryRegistry
    ) {
        super();
        this.notes = this.add(new NoteService(repositories.noteRepository));
    }

}