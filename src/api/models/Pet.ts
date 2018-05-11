import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';
import { TenantScopedModel } from './TenantScopedModel';

@Entity()
export class Pet extends TenantScopedModel {

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @IsNotEmpty()
    @Column()
    public name: string;

    @IsNotEmpty()
    @Column()
    public age: number;

    @Column({
        name: 'user_id',
        nullable: true,
    })
    public userId: number;

    @ManyToOne(type => User, user => user.pets)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    public toString(): string {
        return `${this.name}`;
    }

}
