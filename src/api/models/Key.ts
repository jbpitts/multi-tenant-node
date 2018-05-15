import { Entity, PrimaryColumn } from 'typeorm';

@Entity('key')
export class Key  {

    @PrimaryColumn({name: 'client_id'})
    public clientId: number;

    public toString(): string {
        return `${this.clientId}`;
    }

}
