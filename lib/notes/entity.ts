import {Entity} from '../datastore/entity';
import {Column} from '../datastore/schema/columns/decorator';
import {NoteData} from './data';

export class Note extends Entity implements NoteData {

    @Column()
    public title: string;

}