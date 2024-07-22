import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Genesis, Node } from '.';

/**
 * Geth node datadir
 */
@Entity()
export class DataDir {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    dir: string;

    @ManyToOne(() => Genesis)
    @JoinColumn()
    genesis: Genesis;

    @OneToOne(() => Node, (n) => n.dataDir, { nullable: true })
    node?: Node;

    constructor(partial: Partial<DataDir>) {
        Object.assign(this, partial);
    }
}
