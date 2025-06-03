import { DataSource, Repository } from "typeorm";
import {Blog} from '../entity/BlogModel'
import Gemini from "../services/AIPromtService"

export class BlogService {
    protected blogRepo : Repository<Blog>;

    constructor(private datasource: DataSource) {
        this.blogRepo = this.datasource.getRepository(Blog)
    }
    
     private cutBlogParts(text: string){
         let match;
        let answer = {}
        match = text.match(/#title_start#([\s\S]*?)#title_end#/)
        if(match){
            answer['title'] =  match[1].trim()
        }
         match = text.match(/#description_start_text_start#([\s\S]*?)#description_start_text_end#/)
          if(match){
            answer['description_start_text'] =  match[1].trim()
        }
        match = text.match(/#description_start#([\s\S]*?)#description_end#/)
        if(match){
            answer['description'] = match[1].trim()
        }
        match = text.match(/#summary_start#([\s\S]*?)#summary_end#/)
        if(match){
             answer['summary'] = match[1].trim()
        }
        match = text.match(/#keywords_start#([\s\S]*?)#keywords_end#/)
        if(match){
            answer['keywords'] = JSON.stringify(match[1].trim().split(',')) 
        }

        if(answer['description'] && answer['summary']){
            answer['sub_description'] = answer['description'].concat(answer['summary'])
        }
        return answer
     }
     async create(blogData: Partial<Blog>): Promise<Blog> {
        const blog_prompt =  await Gemini.generateBlogContent(blogData.title || null)

        const _blog_text_parts = this.cutBlogParts(blog_prompt.text);

        const blog = this.blogRepo.create({...blogData, ..._blog_text_parts});
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