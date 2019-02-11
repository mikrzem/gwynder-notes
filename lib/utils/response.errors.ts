export class ResponseError {

    constructor(
        public readonly status: number,
        public readonly message: string
    ) { }

}

export class DataNotFound extends ResponseError {

    constructor(
        content: string
    ) {
        super(404, `Data not found ${content}`);
    }

}