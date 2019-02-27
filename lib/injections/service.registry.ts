import {BaseService} from '../base/service';
import {RegistrationService} from '../hosting/register';
import {NoteService} from '../notes/service';
import {PagingService} from '../utils/paging.service';
import {Registry} from './registry';
import {RepositoryRegistry} from './repository.registry';
import {NoteSegmentService} from '../segments/service';

export class ServiceRegistry extends Registry<BaseService> {

    public readonly paging: PagingService;

    public readonly notes: NoteService;

    public readonly registration: RegistrationService;

    public readonly segments: NoteSegmentService;

    constructor(
        private readonly repositories: RepositoryRegistry
    ) {
        super();
        this.registration = this.add(new RegistrationService());
        this.paging = this.add(new PagingService());
        this.segments = this.add(new NoteSegmentService());
        this.notes = this.add(
            new NoteService(
                repositories.noteRepository,
                this.paging,
                this.segments
            )
        );
    }

    public async initialize() {
        await Promise.all(
            this.all.map(service => service.initialize())
        );
    }

}