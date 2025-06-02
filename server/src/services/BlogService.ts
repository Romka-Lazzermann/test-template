import { DataSource, Repository } from "typeorm";
import {Blog} from '../entity/BlogModel'

export class BlogService {
     protected blogRepo : Repository<Blog> | null = null;

    constructor(private datasource: DataSource) {
        this.blogRepo = this.datasource.getRepository(Blog)
    }

     async create(blogData: Partial<Blog>): Promise<Blog> {
        // const blog = this.blogRepo.create(blogData);
        // return await this.blogRepo.save(blog);
    }

    async findAll(): Promise<Blog[]> {
        return await this.blogRepo.find({relations: ['category_id']})
    }
}