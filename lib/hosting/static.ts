import * as express from 'express';
import * as path from 'path';
import {BaseService} from '../base/service';

export class StaticFiles extends BaseService {

    constructor(
        private readonly app: express.Application
    ) {
        super();
    }

    private get applicationDirectory(): string {
        return process.env['notes_application_directory'];
    }

    private get indexFile(): string {
        return path.join(this.applicationDirectory, 'index.html');
    }

    public async initialize() {
        this.app.use(
            '/application/notes/resources',
            express.static(
                this.applicationDirectory
            )
        );
        this.logger.info(`Hosting directory ${this.applicationDirectory} as /application/notes/resources`);
        this.app.get(
            '/application/notes/page/*',
            (request, response) => {
                response.sendFile(this.indexFile)
            }
        );
        this.app.get(
            '/application/notes/page',
            (request, response) => {
                response.redirect('/application/notes/page/');
            }
        );
        this.logger.info(`Hosting file ${this.indexFile} as /application/notes/page/**`);
    }
}