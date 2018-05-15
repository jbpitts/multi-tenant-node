
import { HttpError } from 'routing-controllers';

export class ClientNotFoundError extends HttpError {
    constructor() {
        super(404, 'Client not found!');
    }
}
