import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";

@Entity()
export class Links {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "text" })
    name!: string

    @Column({ type: "varchar", length: 100, nullable: true })
    domain!: string | null

    @Column({ type: "int", width: 11, default: 0 })
    status!: number

    @Column({ type: "int", width: 11, default: 0 })
    try!: number

    @Column({ type: "int", width: 11, default: 0 })
    user_id!: number

    @Column({ type: "varchar", length: 50, nullable: true })
    geo!: string | null

    @Column({ type: "varchar", length: 50, nullable: true })
    lang!: string | null

    @Column({ type: "int", width: 11, default: 0 })
    time_create!: number

    @Column({ type: "varchar", length: 100, nullable: true })
    offer!: string | null

    @Column({ type: "text" })
    title!: string

    @Column({ type: "text" })
    title_white!: string

    @Column({ type: "text" })
    description!: string

    @Column({ type: "text" })
    description_white!: string

    @Column({ type: "text" })
    sub_description!: string

    @Column({ type: "text" })
    img!: string

    @Column({ type: "text" })
    keywords!: string

    @Column({ type: "text" })
    keywords_white!: string

    @Column({ type: "varchar", length: 100, nullable: true })
    postback!: string | null


    @Column({ type: "varchar", length: 100, nullable: true })
    pixel_id!: string | null

    @Column({ type: "text" })
    pixel_token!: string

    @Column({ type: "varchar", length: 50, nullable: true })
    pixel_event!: string | null

    @Column({ type: "int", width: 11, default: 0 })
    channel_id!: number

    @Column({ type: "varchar", length: 100, nullable: true })
    channel_offer!: number | null

    @Column({ type: "int", width: 11, default: 0 })
    team_id!: number

    @Column({ type: 'int', default: 0 })
    team_user_id!: number;

    @Column({ type: 'int', default: 0 })
    ubi_user_id!: number;

    @Column({ type: 'int', default: 0 })
    campaign_global_id!: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    campaign_global_name!: string | null;

    @Column({ type: 'int', default: 0 })
    adw_id!: number;

    @Column({ type: 'int', default: 0 })
    multilang!: number;

    @Column({ type: 'int', default: 0 })
    pagespeed!: number;

}
