import {NoteSegmentText} from './text/data';
import {NoteSegmentChecklist} from './checklist/data';

export interface NoteSegment {

    text?: NoteSegmentText;
    checklist?: NoteSegmentChecklist;

}