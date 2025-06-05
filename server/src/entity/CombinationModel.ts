import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Channel } from "./ChannelModel";
import { Style } from "./StyleModel";

@Entity()
export class Combinations {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Channel, channel => channel.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'channel_id' })
    channel!: Channel

    @ManyToOne(() => Style, style => style.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'style_id' })
    style!: Style

    @Column({type: "int"})
    style_id!: number;

    @Column({type: "int"})
    channel_id!: number;
}