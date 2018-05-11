import { EventSubscriber, InsertEvent, EntitySubscriberInterface } from 'typeorm';

import { Key } from '../models/Key';
import { Client } from '../models/Client';

@EventSubscriber()
export class ClientSubscriber implements EntitySubscriberInterface<Client> {

    /**
     * Indicates that this subscriber only listen to Post events.
     */
    public listenTo(): any {
        return Client;
    }

    /**
     * Called after insertion.
     */
    public afterInsert(event: InsertEvent<Client>): Promise<any> {
        const key = new Key();
        key.clientId = event.entity.id;

        return event.connection.getRepository(Key).save(key);
        // await event.connection.createQueryBuilder().insert().into(Key).values([{client_id: 1}]);
    }

}
