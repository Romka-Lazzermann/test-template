import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import {Links} from './LinkModel'


@Entity()
export class Impressions {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Links, Links => Links.id)
    @JoinColumn({ name: 'link_id' })
    link!: Links

    @Column({ type: 'int', default: 0 })
    user_id!: number;

    @Column({ type: 'int', default: 0 })
    combination_id!: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    style_id!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    channel_key!: string;

    @Column({ type: 'int', default: 0 })
    channel_id!: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    channel_offer!: string;

    @Column({ type: 'int', default: 0 })
    link_id!: number;

    @Column({ type: 'int', default: 0 })
    time!: number;

    @Column({ type: 'enum', enum: ['created', 'clicked', 'sent'], default: 'created' })
    status!: 'created' | 'clicked' | 'sent';

    @Column({ type: 'int', default: 0 })
    clicks!: number;

    @Column({ type: 'text', nullable: true })
    click_id!: string;

    @Column({ type: 'text', nullable: true })
    subid!: string;

    @Column({ type: 'text', nullable: true })
    fbclid!: string;

    @Column({type: 'text', nullable: true})
    ttclid!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ip!: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    geo!: string;

    @Column({ type: 'text', nullable: true })
    ua!: string;

    @Column({ type: 'int', default: 0 })
    ismob!: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    os!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    f_os!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    f_platform!: string;

    @Column({ type: 'int', default: 0 })
    f_touch!: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    lang!: string;

    @Column({ type: 'text', nullable: true })
    pb_log!: string;

    @Column({ type: 'int', default: 0 })
    ad!: number;

    @Column({ type: 'varchar', length: 200, nullable: true })
    referer_host!: string;

    @Column({ type: 'text', nullable: true })
    referer!: string;

    @Column({ type: 'int', default: 0 })
    clc!: number;

    @Column({ type: 'int', default: 0 })
    adw_cron1!: number;

    @Column({ type: 'int', default: 0 })
    local!: number;
}