import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { Account, DataDir } from '.';

export enum EProtocol {
    WebSocket = 'WebSocket',
    Http = 'Http',
}

export interface NodeEndpoint {
    port: number;
    protocol: EProtocol;
}

/**
 * Geth node configuration and logs
 */
@Entity()
export class Node {
    @PrimaryColumn()
    id: string;

    @Column()
    pid: number;

    @Column()
    logFile: string;

    @Column()
    name: string;

    @Column({ type: 'jsonb', default: '[]' })
    endpoints: NodeEndpoint[];

    @OneToOne(() => DataDir, (d) => d.node)
    @JoinColumn()
    dataDir: DataDir;

    @Column()
    port: number;

    @Column()
    authRpcPort: number;

    @ManyToOne(() => Node, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    bootnode?: Node;

    @ManyToOne(() => Account, { nullable: true })
    @JoinColumn()
    minerAccount?: Account;

    @CreateDateColumn()
    createdAt: Date;
    
    constructor(partial: Partial<Node>) {
        Object.assign(this, partial);
    }
}
