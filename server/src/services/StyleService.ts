import { DataSource, Repository } from "typeorm";
import { Style } from "../entity/StyleModel";
import { inject, injectable } from 'tsyringe'

@injectable()
export class StyleService {
    protected StyleRepo: Repository<Style>;

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.StyleRepo = datasource.getRepository(Style);
    }


    async findAll() {
        return await this.StyleRepo.find();
    }

    async create(data: Partial<Style>) {
        const _style = await this.StyleRepo.findBy({
            style_key : data.style_key
        })
        if(_style){
            return null
        }
        const Style = this.StyleRepo.create(data);
        return await this.StyleRepo.save(Style);
    }

}