import {Request, Response, Router} from 'express';
import {getOwner, loadOwner} from '../utils/owner.reader';
import {ResponseError} from '../utils/response.errors';
import {BaseService} from './service';

export interface ResponseCreatorParams {
    owner: string,
    request: Request,
    response: Response
}

type ResponseCreator = (params: ResponseCreatorParams) => Promise<any>;

export abstract class RouterBuilder extends BaseService {

    private readonly _router: Router = Router();

    protected constructor() {
        super();
        this.router.use(loadOwner);
        this.initializeRoutes();
    }

    get router() {
        return this._router;
    }

    get rootPath() {
        return '/';
    }

    protected abstract initializeRoutes();

    protected get(path: string, callback: ResponseCreator) {
        this.router.get(path, this.wrapRequest(callback));
    }

    protected post(path: string, callback: ResponseCreator) {
        this.router.post(path, this.wrapRequest(callback));
    }

    protected put(path: string, callback: ResponseCreator) {
        this.router.put(path, this.wrapRequest(callback));
    }

    protected delete(path: string, callback: ResponseCreator) {
        this.router.delete(path, this.wrapRequest(callback));
    }

    private wrapRequest(callback: ResponseCreator): (
        request: Request, response: Response) => void {
        return (request: Request, response: Response) => {
            callback({
                owner: getOwner(request),
                request: request,
                response: response
            })
                .then(result => this.sendResponse(result, response))
                .catch(error => this.errorResponse(error, response));
        }
    }

    private sendResponse(result: any, response: Response) {
        if (result === null || result === undefined) {
            response.send();
        } else {
            response.send(result);
        }
    }

    private errorResponse(error: any, response: Response) {
        if (error instanceof ResponseError) {
            response.status(error.status).send(error.message);
        } else {
            this.logger.error('Internal error', {error: error});
            response.status(500).send('Internal server error');
        }
    }
}