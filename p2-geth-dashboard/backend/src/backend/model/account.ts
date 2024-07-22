import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GenesisAccount } from '.';

/**
 * Geth account
 */
@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    secretKeyPath: string;

    @Column()
    address: string;

    @Column()
    password: string;

    @OneToMany(() => GenesisAccount, (ga) => ga.account)
    genesis: GenesisAccount[];

    constructor(partial: Partial<Account>) {
        Object.assign(this, partial);
    }
}