import {BaseData} from '../datastore/data';
import {NoteSegment} from '../segments/data';

export interface NoteData extends BaseData {

    title: string;

    segments: NoteSegment[];

}