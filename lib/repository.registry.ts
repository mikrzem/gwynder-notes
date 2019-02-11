import {Database} from './datastore/database';
import {EntityRepository} from './datastore/repository';
import {NoteRepository} from './notes/repository';
import {Registry} from './registry';

export class RepositoryRegistry extends Registry {

    private readonly repositories: EntityRepository<any>[] = [];

    public readonly noteRepository: NoteRepository;

    constructor(
        private readonly database: Database
    ) {
        super();
        this.noteRepository = this.database.createRepository(NoteRepository);
        this.repositories.push(this.noteRepository);
    }

    public async initialize() {
        await Promise.all(
            this.repositories.map(repository => repository.initialize())
        );
    }

}