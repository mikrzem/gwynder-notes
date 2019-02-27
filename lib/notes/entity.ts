import {Entity} from '../datastore/entity';
import {Column} from '../datastore/schema/columns/decorator';
import {NoteData} from './data';
import {NoteSegment} from '../segments/data';

export class Note extends Entity implements NoteData {

    @Column()
    public title: string;

    @Column({default: []})
    public segments: NoteSegment[] = [];

}