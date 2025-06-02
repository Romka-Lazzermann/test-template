import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Blog } from "./BlogModel";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, type: "text"})
    title: string;

    @Column({nullable: true, type: "text"})
    name: string;

    @Column({type: "int"})
    status: number;

    @Column({type: "timestamp"})
    time_create: number

    @Column({nullable: true, type: "text"})
    description: string;

    @OneToMany(() => Blog, (blog) => blog.category_id)
    blogs: Blog[];
}