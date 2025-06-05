import { DataSource, Repository } from "typeorm";
import { Combinations } from "../entity/CombinationModel";
import { ChannelService } from "./ChannelService";
import { StyleService } from "./StyleService";
import { inject, injectable, container } from 'tsyringe'

@injectable()
export class CombinationService {
    protected CombinationRepo: Repository<Combinations>;

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.CombinationRepo = datasource.getRepository(Combinations);
    }


    async fillCombinations() {
        const channelService = container.resolve(ChannelService)
        const styleService = container.resolve(StyleService)

        const channelIds = await channelService.selectAllId();
        const styleIds = await styleService.selectAllId();

        const existedCombos = await this.CombinationRepo
            .createQueryBuilder('c')
            .select(['c.style_id', 'c.channel_id'])
            .getRawMany();

        const existedSet = new Set(
            existedCombos.map(c => `${c.style_id}_${c.channel_id}`)
        );

        const insertRows : Array<Partial<Combinations>> = [];

        for (const channel of channelIds) {
            for (const style of styleIds) {
                if (!existedSet.has(`${style.id}_${channel.id}`)) {
                    insertRows.push({ style_id:  style.id, channel_id: channel.id });
                }
            }
        }

        if(insertRows.length > 0){
            return await this.CombinationRepo
            .createQueryBuilder()
            .insert()
            .into(Combinations)
            .values(insertRows)
            .orIgnore()
            .execute();
        }
        return []
    }
}