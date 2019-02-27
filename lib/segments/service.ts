import {BaseService} from '../base/service';
import {NoteSegment} from './data';
import {NoteData} from '../notes/data';

export class NoteSegmentService extends BaseService {

    public validateNote(note: NoteData) {
        for (const segment of note.segments) {
            this.validate(segment);
        }
    }

    public validate(segment: NoteSegment) {
        let typeCount = 0;
        if (segment.text) {
            typeCount++;
        }
        if (segment.checklist) {
            typeCount++;
        }
        if (typeCount !== 1) {
            throw new Error('Segment must be of exactly one type');
        }
    }

}