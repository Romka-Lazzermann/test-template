import { DataSource, Repository } from "typeorm";
import {Blog} from '../entity/BlogModel'

export class BlogService {
     protected blogRepo : Repository<Blog>;

    constructor(private datasource: DataSource) {
        this.blogRepo = this.datasource.getRepository(Blog)
    }

     async create(blogData: Partial<Blog>): Promise<Blog> {
        const blog = this.blogRepo.create(blogData);
        blog.time_create = Math.floor(Date.now() / 1000);
        return await this.blogRepo.save(blog);
    }

    async findAll(): Promise<Blog[]> {
        return await this.blogRepo.find({relations: ['category_id']})
    }

    async findOne(id: number): Promise<Blog | null> {
        return await this.blogRepo.findOne({ where: { id }, relations: ['category_id'] });
    }

    async update(id: number, updateData: Partial<Blog>): Promise<Blog | null> {
        const blog = await this.blogRepo.findOneBy({ id });
        if (!blog) return null;
        Object.assign(blog, updateData);
        return await this.blogRepo.save(blog);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.blogRepo.delete(id);
        return result.affected !== 0;
    }
}