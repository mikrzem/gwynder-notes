import {BaseService} from '../base/service';
import {RegistrationService} from '../hosting/register';
import {NoteService} from '../notes/service';
import {PagingService} from '../utils/paging.service';
import {Registry} from './registry';
import {RepositoryRegistry} from './repository.registry';

export class ServiceRegistry extends Registry<BaseService> {

    public readonly paging: PagingService;

    public readonly notes: NoteService;

    public readonly registration: RegistrationService;

    constructor(
        private readonly repositories: RepositoryRegistry
    ) {
        super();
        this.registration = this.add(new RegistrationService());
        this.paging = this.add(new PagingService());
        this.notes = this.add(new NoteService(repositories.noteRepository, this.paging));
    }

    public async initialize() {
        await Promise.all(
            this.all.map(service => service.initialize())
        );
    }

}