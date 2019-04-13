import {RouterBuilder} from '../base/router';
import {NoteService} from '../notes/service';

interface DashboardInfo {

    title: string;
    rows: DashboardInfoRow[];

}

interface DashboardInfoRow {

    description: string;
    content: string;

}

export class DashboardRouter extends RouterBuilder {

    constructor(
        private readonly noteService: NoteService
    ) {
        super();
    }

    get rootPath() {
        return '/api/notes/central/dashboard';
    }

    protected initializeRoutes() {
        this.get(
            '/',
            params => {
                return this.createDashboard(params.owner)
            }
        )
    }

    private async createDashboard(owner: string): Promise<DashboardInfo> {
        return {
            title: 'Notes',
            rows: [
                await this.notesCountRow(owner)
            ]
        };
    }

    private async notesCountRow(owner: string): Promise<DashboardInfoRow> {
        const count = await this.noteService.count(owner);
        return {
            description: 'Count',
            content: count.toString()
        };
    }

}