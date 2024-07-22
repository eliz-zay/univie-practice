import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { DataDir, GenesisAccount } from '.';

/**
 * genesis.json
 */
@Entity()
export class Genesis {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    networkId: string;

    @Column()
    filePath: string;

    @OneToMany(() => DataDir, (d) => d.genesis)
    dataDirs: DataDir[];

    @OneToMany(() => GenesisAccount, (a) => a.genesis)
    genesisAccounts: GenesisAccount[];

    constructor(partial: Partial<Genesis>) {
        Object.assign(this, partial);
    }
}
