import { DataSource, Not, Repository } from "typeorm";
import { Category } from "../entity/CategoryModel";
import { inject, injectable } from 'tsyringe'

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

  async findOneByName(name: string) {
    return await this.CategoryRepo.findOneBy({ name });
  }

  async create(data: Partial<Category>) {

    if (!data?.name) {
      data.name = data.title?.toLowerCase();
    }
    const _category = await this.CategoryRepo.findBy({
      name: data.name
    })
    if (_category?.length) {
      return null
    }

    data.time_create = Math.floor(Date.now() / 1000);
    const category = this.CategoryRepo.create(data);
    return await this.CategoryRepo.save(category);
  }

  async update(id: number, data: Partial<Category>) {
    const name = data?.title?.toLowerCase();
    const _category = await this.CategoryRepo.findOne({
      where: {
        name: name,
        id: Not(id)
      }
    })
    if (_category) {
      return null
    }
    await this.CategoryRepo.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number) {
    return await this.CategoryRepo.delete(id);
  }
}
