import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./CategoryModel";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Category, (category) => category.blogs, {nullable: false})
    @JoinColumn({ name: 'category_id' })
    category_id: Category

    @Column({nullable: true, type: "text"})
    name: string

    @Column({type: "int"})
    status: number

    @Column({type: "timestamp"})
    time_create: number

    @Column({nullable: true, type: "text"})
    title: string

    @Column({nullable: true, type: "text"})
    description: string

    @Column({nullable: true, type: "text"})
    sub_description: string

    @Column({nullable: true, type: "text"})
    img: string

    @Column({nullable: true, type: "text"})
    keywords: string

    @Column({type: "int"})
    view: number
}