import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'links_multilang' })
export class LinksMultilang {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', default: 0 })
    link_id!: number;

    @Column({ type: 'int', default: 0 })
    status!: number;

    @Column({ type: 'int', default: 0 })
    try!: number;

    @Column({ type: 'varchar', length: 10, nullable: true })
    lang!: string | null;

    @Column({ type: 'text', nullable: true })
    title!: string | null;

    @Column({ type: 'text', nullable: true })
    description!: string | null;

    @Column({ type: 'text', nullable: true })
    sub_description!: string | null;

    @Column({ type: 'text', nullable: true })
    keywords!: string | null;

    @Column({ type: 'int', default: 0 })
    pagespeed!: number;
}