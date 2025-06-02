import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Style {
    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 100, nullable: true})
    style_key: string
}