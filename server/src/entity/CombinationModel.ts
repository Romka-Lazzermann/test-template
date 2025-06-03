import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Channel } from "./ChannelModel";
import { Style } from "./StyleModel";

@Entity()
export class Combination {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Channel, channel => channel.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'channel_id' })
    channel!: Channel

    @ManyToOne(() => Style, style => style.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'style_id' })
    style!: Style
}