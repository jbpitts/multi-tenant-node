import { HttpError } from 'routing-controllers';

export class NotAuthorized extends HttpError {
    constructor() {
        super(401, 'Not Authorized');
    }
}
