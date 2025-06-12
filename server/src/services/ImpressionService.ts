import { DataSource, Repository } from "typeorm";
import { Impressions } from "../entity/ImpressionModel";
import { CombinationService } from './CombinationService'
import { inject, injectable, container } from 'tsyringe'
import { Combinations } from "../entity/CombinationModel";

@injectable()
export class ImpressionService {
    protected ImpressionRepo: Repository<Impressions>

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.ImpressionRepo = datasource.getRepository(Impressions);
    }
    
    async create(link_id: number, sub_id: string, fbclid = '', ttclid = ''){
        const combinationService = container.resolve(CombinationService);
        let combination : Partial<Combinations | null> =  {}
        combination = await combinationService.findCombinationByLinkSubID(link_id, sub_id)
        if(!combination){
            combination = await combinationService.linkCombination(link_id, sub_id)
        }
        
        const impression = await this.ImpressionRepo.create({})
        impression.combination_id = combination?.id || 0
        impression.channel_id = combination?.channel_id || 0
        impression.style_id = combination?.style_id || ''


        impression.link_id = combination?.link_id || 0
        impression.subid = combination?.subid || ''
        
        impression.fbclid = fbclid || ''
        impression.ttclid = ttclid || ''
        impression.time = Date.now() / 1000
        await this.ImpressionRepo.save(impression)
        console.log("impression", impression.id);
        return impression;
    }

    async click(impression_id : number) {
        const impression = await this.ImpressionRepo.findOne({
            where: {
                id: impression_id
            }
        })
        if(!impression){
            return null
        }
        if(impression.status === 'clicked'){
            return impression;
        }
        impression.status = 'clicked'
        await this.ImpressionRepo.save(impression)
        return impression
    }


}