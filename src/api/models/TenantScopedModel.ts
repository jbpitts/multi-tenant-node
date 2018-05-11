
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
}
