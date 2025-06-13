import { DataSource, Repository } from "typeorm";
import { Blog } from '../entity/BlogModel'
// import Gemini from "../services/AIPromtService"
import { injectable, inject } from 'tsyringe';
import path from "path";
import fs from 'fs';
import slugify from "slugify";
import { cutThePrompt } from "../helpers/format";
@injectable()
export class BlogService {
    protected blogRepo: Repository<Blog>;

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.blogRepo = this.datasource.getRepository(Blog)
    }

    async create(blogData: Partial<Blog>): Promise<Blog | null> {

        const name = slugify(blogData?.title || '', {
            locale: 'en',
            replacement: '_',
            lower: true,
            strict: true
        })

        blogData['name'] = name;
        blogData['status'] = 0;
        const blog = this.blogRepo.create({ ...blogData });
        blog.time_create = Math.floor(Date.now() / 1000);
        const _blog = await this.blogRepo.save(blog);
        const populated_blog = await this.blogRepo.findOne({
            relations: ['category_id'],
            where: { id: _blog.id }
        })
        return populated_blog || null
    }

    async addGenerated(blogId : number, content: any){
        const blog = await this.blogRepo.findOne({ where: {id: blogId}  });
        const _blog_text_parts = cutThePrompt(false, false, content.text);
        if(!blog){
            return null
        }
        blog.status = 1
        const data_save = {...blog, ..._blog_text_parts}
        data_save['description'] = _blog_text_parts['description_start_text']
        const title = data_save['title'].replace(/<[^>]+>/g, '');
        data_save['title'] = title
        const saved = await this.blogRepo.save({...data_save})
        return saved
    }

    async findAll(): Promise<Blog[]> {
        return await this.blogRepo.find({ relations: ['category_id'] })
    }

    async findOne(id: number): Promise<Blog | null> {
        return await this.blogRepo.findOne({ where: { id }, relations: ['category_id'] });
    }

    async increment(id: number) {
        await this.blogRepo
            .createQueryBuilder()
            .update(Blog)
            .set({ view: () => "view + 1" })
            .where("id = :id", { id: id })
            .execute()
    }

    async getPopular() {
        return await this.blogRepo
            .createQueryBuilder("blog")
            .innerJoinAndSelect(
                "blog.category_id",
                "category",
                "category.id = blog.category_id",
            )
            .orderBy('blog.view', 'DESC')
            .limit(16)
            .getRawMany()
    }

    async getLatest() {
        return await this.blogRepo
            .createQueryBuilder("blog")
            .innerJoinAndSelect(
                "blog.category_id",
                "category",
                "category.id = blog.category_id",
            )
            .orderBy('blog.time_create', 'DESC')
            .limit(16)
            .getRawMany()
    }

    async getByCategoryId(category_id: number) {
        return await this.blogRepo
            .createQueryBuilder("blog")
            .innerJoinAndSelect(
                "blog.category_id",
                "category",
                "category.id = blog.category_id",
            )
            .where('blog.category_id = :category_id', { category_id: category_id })
            .orderBy('blog.time_create', 'DESC')
            .limit(20)
            .getRawMany()
    }

    async getRecent(blog_id: number) {
        return await this.blogRepo
            .createQueryBuilder("blog")
            .innerJoinAndSelect(
                "blog.category_id",
                "category",
                "category.id = blog.category_id",
            )
            .where('blog.id != :blog_id', { blog_id: blog_id })
            .orderBy('blog.time_create', 'DESC')
            .limit(4)
            .getRawMany()
    }



    async update(id: number, updateData: Partial<Blog>): Promise<Blog | null> {
        console.log("UpdatedData",updateData )
        const blog = await this.blogRepo.findOneBy({ id });
        if (!blog) return null;
        if (updateData?.img) {
            const filepath = path.join(__dirname, '../..', blog.img)
            fs.unlink(filepath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error while deleting file", unlinkErr)
                }
            })
        }else {
            delete updateData['img']
        }
        Object.assign(blog, updateData);

        const _blog = await this.blogRepo.save(blog);
        const populated_blog = await this.blogRepo.findOne({
            relations: ['category_id'],
            where: { id: _blog.id }
        })


        return populated_blog || null
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.blogRepo.delete(id);
        return result.affected !== 0;
    }
}