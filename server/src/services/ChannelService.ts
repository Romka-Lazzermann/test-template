import { DataSource, Not, Repository } from "typeorm";
import { Channel } from "../entity/ChannelModel";
import { inject, injectable, container } from 'tsyringe'
import { CombinationService } from "./CombinationService";

@injectable()
export class ChannelService {
    protected ChannelRepo: Repository<Channel>;

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.ChannelRepo = datasource.getRepository(Channel);
    }


    async findAll() {
        return await this.ChannelRepo.find();
    }

    async selectAllId() {
        return await this.ChannelRepo.find({ select: ['id'] })
    }

    async create(data: Partial<Channel>) {
        const combinationService = container.resolve(CombinationService)
        const _channel = await this.ChannelRepo.findBy({
            channel_value: data.channel_value,
            channel_key: data.channel_key
        })
        if (_channel?.length) {
            return null
        }
        const channel = this.ChannelRepo.create({...data});
        const _saved = await this.ChannelRepo.save({channel_key: channel.channel_key, channel_value: channel.channel_value});
        await combinationService.fillCombinations();
        return _saved
    }

    async update(id: number, data: Partial<Channel>){
         const _channel = await this.ChannelRepo.findOne({
            where: {
                channel_value: data.channel_value,
                channel_key: data.channel_key,
                id: Not(id)
            }   
        })
        if (_channel) {
            return null
        }
        await this.ChannelRepo.update(id, data)
        return this.ChannelRepo.findOneBy({
            id
        })
    }

}