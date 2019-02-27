export interface NoteSegmentChecklist {

    entries: NoteSegmentChecklistEntry[];

}

export interface NoteSegmentChecklistEntry {

    text: string;
    checked: boolean;
    entries: NoteSegmentChecklistEntry[];

}