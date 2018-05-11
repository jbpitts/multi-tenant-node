import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Pet } from './Pet';
import { TenantScopedModel } from './TenantScopedModel';

@Entity()
export class User extends TenantScopedModel {

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'first_name' })
    public firstName: string;

    @IsNotEmpty()
    @Column({ name: 'last_name' })
    public lastName: string;

    @IsNotEmpty()
    @Column()
    public email: string;

    @OneToMany(type => Pet, pet => pet.user)
    public pets: Pet[];

    public toString(): string {
        return `${this.firstName} ${this.lastName} (${this.email})`;
    }

}
