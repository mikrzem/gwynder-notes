import {Pool} from 'pg';
import {EntityRepository} from '../datastore/repository';
import {NoteData} from './data';
import {Note} from './entity';

export class NoteRepository extends EntityRepository<Note, NoteData> {

    constructor(
        pool: Pool
    ) {
        super(pool, Note);
    }


}