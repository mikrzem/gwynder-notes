import {Pool} from 'pg';
import {EntityRepository} from '../datastore/repository';
import {Note} from './entity';

export class NoteRepository extends EntityRepository<Note> {

    constructor(
        pool: Pool
    ) {
        super(pool, Note);
    }


}