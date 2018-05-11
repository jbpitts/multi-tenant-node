import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn,
    UpdateDateColumn, VersionColumn } from 'typeorm';

import { User } from './User';

@Entity('client')
export class Client  {

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column('integer', {
        default: '0',
        name: 'space_used',
    })
    public spaceUsed: number;

    @Column('integer', {
        default: '0',
        name: 'space_limit',
    })
    public spaceLimit: number;

    @IsNotEmpty()
    @Column({ name: 'created_by'})
    public createdById: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by' })
    public createdBy: User;

    @IsNotEmpty()
    @Column({ name: 'updated_by'})
    public updatedById: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'updated_by' })
    public updatedBy: User;

    @CreateDateColumn({ name: 'created_at'})
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    public updatedAt: Date;

    @VersionColumn()
    public epoch: number;

    @Column({ name: 'company_email', length: 255})
    public companyEmail: string;

    @Column({ name: 'database_name', length: 255})
    public databaseName: string;

    @Column({ name: 'company_phone', length: 255})
    public companyPhone: string;

    @Column({ name: 'company_name', length: 255})
    public companyName: string;

    @IsNotEmpty()
    @Column({ name: 'name', unique: true, length: 255})
    public name: string;

    @Column({ name: 'company_url'})
    public companyUrl: string;

    public toString(): string {
        return `${this.name}`;
    }

}
