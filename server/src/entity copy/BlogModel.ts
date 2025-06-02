import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./CategoryModel";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Category, (category) => category.blogs, {nullable: false})
    @JoinColumn({ name: 'category_id' })
    category_id: Category

    @Column({nullable: true})
    name: string

    @Column()
    status: number

    @Column({type: "timestamp"})
    time_create: number

    @Column({nullable: true})
    title: string

    @Column({nullable: true})
    description: string

    @Column({nullable: true})
    sub_description: string

    @Column({nullable: true})
    img: string

    @Column({nullable: true})
    keywords: string

    @Column()
    view: number
}