import { DataSource, Repository } from "typeorm";
import { Category } from "../entity/CategoryModel";
import {inject, injectable} from 'tsyringe'

@injectable()
export class CategoryService {
  protected CategoryRepo: Repository<Category>;

  constructor(@inject("AppDataSource") private datasource: DataSource) {
    this.CategoryRepo = datasource.getRepository(Category);
  }

  async findAll() {
    return await this.CategoryRepo.find();
  }

  async findOne(id: number) {
    return await this.CategoryRepo.findOneBy({ id });
  }

  async create(data: Partial<Category>) {
    if(!data?.name){
      data.name = data.title?.toLowerCase();
    }
    data.time_create = Math.floor(Date.now() / 1000);
    const category = this.CategoryRepo.create(data);
    return await this.CategoryRepo.save(category);
  }

  async update(id: number, data: Partial<Category>) {
    await this.CategoryRepo.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number) {
    return await this.CategoryRepo.delete(id);
  }
}
