import { Repository } from "typeorm";
import { Category } from "../entity/CategoryModel";

export class CategoryService {
  constructor(private repo: Repository<Category>) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async create(data: Partial<Category>) {
    const category = this.repo.create(data);
    return await this.repo.save(category);
  }

  async update(id: number, data: Partial<Category>) {
    await this.repo.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
