import {Database} from '../datastore/database';
import {EntityRepository} from '../datastore/repository';
import {NoteRepository} from '../notes/repository';
import {Registry} from './registry';

export class RepositoryRegistry extends Registry<EntityRepository<any, any>> {

    public readonly noteRepository: NoteRepository;

    constructor(
        private readonly database: Database
    ) {
        super();
        this.noteRepository = this.add(
            this.database.createRepository(NoteRepository)
        );
    }

    public async initialize() {
        await Promise.all(
            this.all.map(repository => repository.initialize())
        );
    }

}