import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Blog } from "./BlogModel";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    name: string;

    @Column()
    status: number;

    @Column({type: "timestamp"})
    time_create: number

    @Column({nullable: true})
    description: string;

    @OneToMany(() => Blog, (blog) => blog.category_id)
    blogs: Blog[];
}