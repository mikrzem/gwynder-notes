import {BaseService} from '../base/service';
import {CreateResult} from '../datastore/data';
import {PageRequest, PageResponse} from '../datastore/paging';
import {PagingService} from '../utils/paging.service';
import {NoteData} from './data';
import {NoteRepository} from './repository';

export class NoteService extends BaseService {

    constructor(
        private readonly repository: NoteRepository,
        private readonly paging: PagingService
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

    public async selectPage(owner: string, page: PageRequest): Promise<PageResponse<NoteData>> {
        let response = await this.repository.findPage(owner, page);
        return this.paging.mapResponse(response, source => this.repository.createContent(source));
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