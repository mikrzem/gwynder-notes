import {NoteRepository} from './repository';

export class NoteService {

    constructor(
        private readonly repository: NoteRepository
    ) { }

}