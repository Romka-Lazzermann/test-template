import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Channel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, length: 100})
    channel_key : string

    @Column({nullable: true, length: 100})
    channel_value: string
}