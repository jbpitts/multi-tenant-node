import { Entity, PrimaryColumn } from 'typeorm';

@Entity('key')
export class Key  {

    @PrimaryColumn({name: 'client_id'})
    public clientId: number;

    // @Column({default: '0'})
    // public user: number;
    //
    // @Column({default: '0'})
    // public pet: number;

    public toString(): string {
        return `${this.clientId}`;
    }

}
