
import { IsNotEmpty } from 'class-validator';
import { Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, Generated } from 'typeorm';

import { User } from './User';

export class TenantScopedModel {

    // @Column({nullable: true})
    @Column()
    @Generated()
    public key: number;

    @IsNotEmpty()
    @Column({name: 'client_id'})
    public clientId: number;

    @IsNotEmpty()
    @Column({ name: 'created_by'})
    public createdById: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by' })
    public createdBy: Promise<User>;

    @IsNotEmpty()
    @Column({ name: 'updated_by'})
    public updatedById: number;

    @ManyToOne(type => User)
    @JoinColumn([{name: 'client_id', referencedColumnName: 'clientId'}, { name: 'updated_by', referencedColumnName: 'key'}])
    public updatedBy: Promise<User>;

    @CreateDateColumn({ name: 'created_at'})
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    public updatedAt: Date;

    @VersionColumn()
    public epoch: number;
}
