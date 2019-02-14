import {BaseService} from '../base/service';
import {CreateResult} from '../datastore/data';
import {NoteData} from './data';
import {NoteRepository} from './repository';

export class NoteService extends BaseService {

    constructor(
        private readonly repository: NoteRepository
    ) {
        super();
    }

    public async get(id: number, owner: string): Promise<NoteData> {
        let note = await this.repository.find(id, owner);
        return this.repository.createContent(note);
    }

    public async selectAll(owner: string): Promise<NoteData[]> {
        let notes = await this.repository.findAll(owner);
        return notes.map(note => this.repository.createContent(note));
    }

    public async create(content: NoteData, owner: string): Promise<CreateResult> {
        return await this.repository.create(content, owner);
    }

    public async update(content: NoteData, id: number, owner: string) {
        await this.repository.update(content, id, owner);
    }

    public async delete(id: number, owner: string) {
        await this.repository.delete(id, owner);
    }
}