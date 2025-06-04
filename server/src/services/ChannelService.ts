import { DataSource, Repository } from "typeorm";
import { Channel } from "../entity/ChannelModel";
import { inject, injectable } from 'tsyringe'

@injectable()
export class ChannelService {
    protected ChannelRepo: Repository<Channel>;

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.ChannelRepo = datasource.getRepository(Channel);
    }


    async findAll() {
        return await this.ChannelRepo.find();
    }

    async create(data: Partial<Channel>) {
        const _channel = await this.ChannelRepo.findBy({
            channel_value: data.channel_value,
            channel_key: data.channel_key
        })
        if(_channel?.length){
            return null
        }
        const channel = this.ChannelRepo.create(data);
        return await this.ChannelRepo.save(channel);
    }

}