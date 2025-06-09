import { DataSource, Not, Repository } from "typeorm";
import { Style } from "../entity/StyleModel";
import { inject, injectable, container } from 'tsyringe'
import { CombinationService } from "./CombinationService";

@injectable()
export class StyleService {
    protected StyleRepo: Repository<Style>;

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.StyleRepo = datasource.getRepository(Style);
    }


    async findAll() {
        return await this.StyleRepo.find();
    }

    async selectAllId() {
        return await this.StyleRepo.find({ select: ['style_key'] });
    }

    async create(data: Partial<Style>) {
        const combinationService = container.resolve(CombinationService)
        const _style = await this.StyleRepo.findBy({
            style_key: data.style_key
        })
        if (_style?.length) {
            return null
        }
        const Style = this.StyleRepo.create(data);
        const saved = await this.StyleRepo.save(Style);
        await combinationService.fillCombinations();
        return saved;
    }

    async update(id: number, data: Partial<Style>){
        const _style = await this.StyleRepo.findOne({
            where: {
                style_key: data.style_key,
                id: Not(id)
            }
            
        })
        if (_style) {
            return null
        }
        await this.StyleRepo.update(id, data)
        return await this.StyleRepo.findOneBy({
            id: id
        })
    }

}