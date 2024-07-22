import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account, Genesis } from '.';

/**
 * An account configured in genesis.json
 */
@Entity()
export class GenesisAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    isSigner: boolean;

    @ManyToOne(() => Account, (a) => a.genesis, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column({ name: 'account_id' })
    accountId: string;

    @ManyToOne(() => Genesis, (g) => g.genesisAccounts, { onDelete: 'CASCADE' })
    @JoinColumn()
    genesis: Genesis;

    constructor(partial: Partial<GenesisAccount>) {
        Object.assign(this, partial);
    }
}
