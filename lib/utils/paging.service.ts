import {Request} from 'express';
import {BaseService} from '../base/service';
import {PageRequest, PageResponse} from '../datastore/paging';

export class PagingService extends BaseService {

    public readRequest(request: Request): PageRequest {
        return {
            page: parseInt(request.query['page'], 10) || 0,
            pageSize: parseInt(request.query['pageSize'], 10) || 10,
            oldestFirst: 'true' === request.query['oldestFirst']
        }
    }

    public mapResponse<Source, Target>(
        response: PageResponse<Source>,
        mapper: (source: Source) => Target
    ): PageResponse<Target> {
        return {
            data: response.data.map(src => mapper(src)),
            count: response.count,
            page: response.page,
            pageSize: response.pageSize,
            totalPages: response.totalPages
        };
    }

}