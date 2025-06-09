import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Channel } from "./ChannelModel";
import { Style } from "./StyleModel";

@Entity()
export class Combinations {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'varchar', length: 100, nullable: true})
    style_id!: string;

    @Column({type: "int"})
    channel_id!: number;

    @Column({ type: 'varchar', length: 200, nullable: true })
    domain!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    channel_key!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    channel_value!: string;

    @Column({ type: 'enum', enum: ['free', 'used'], default: 'free' })
    status!: 'free' | 'used';

    @Column({ type: 'int', default: 0 })
    create_time!: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    channel_offer!: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    subid!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    keyword_text!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    keyword_key!: string;

    @Column({ type: 'int', default: 0 })
    link_id!: number;

    @Column({ type: 'int', default: 0 })
    user_id!: number;

    @Column({ type: 'int', default: 0 })
    team_id!: number;

    @Column({ type: 'int', default: 0 })
    team_user_id!: number;

    @Column({ type: 'int', default: 0 })
    ubi_user_id!: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    campaign_global_id!: string;

    @Column({ type: 'int', default: 0 })
    adw_id!: number;

}