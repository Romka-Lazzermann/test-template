import { DataSource, Repository } from "typeorm";
import { Combinations } from "../entity/CombinationModel";
import { ChannelService } from "./ChannelService";
import { StyleService } from "./StyleService";
import { inject, injectable, container } from 'tsyringe'
import { LinksService } from "./LinksService";

@injectable()
export class CombinationService {
    protected CombinationRepo: Repository<Combinations>;

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.CombinationRepo = datasource.getRepository(Combinations);
    }

    async findCombinationByLinkSubID(link_id: number, subid: string) {
        try {
            const combination = await this.CombinationRepo.findOne({
                where: {
                    link_id: link_id,
                    subid: subid
                }
            })
            return combination || null;

        } catch (err) {
            console.error(err)
            return null
            // return { ok: 0, error: err }
        }

    }

    async findByID(comb_id: number){
         try {
            const combination : any = await this.CombinationRepo.findOne({
                relations: ['channel'],
                where: {
                    id: comb_id
                }
            })
            return {styleID: combination.style_id, channel:  combination.channel.channel_key};

        } catch (err) {
            console.error(err)
            return null
        }
    }

    async linkCombination(link_id: number, subid: string) {
        try {
            const linkService = container.resolve(LinksService)
            const combination = await this.CombinationRepo.findOne({
                where: {
                    status: 'free'
                }
            })
            if(!combination){
                return null
            }
            console.log("link_id", link_id)
            const {link} = await linkService.findByID(link_id)
            if(!link){
                return {ok: 0, error: "Link does not exists"}
            }
            combination.status = 'used';
            combination.create_time = Date.now() / 1000;
            combination.subid = subid
            combination.keyword_key = '78701918'
            combination.keyword_text = '-';
            
            combination.channel_offer = link.channel_offer
            combination.link_id = link?.id
            combination.user_id = link?.user_id
            combination.team_id = link?.team_id
            combination.team_user_id = link?.team_user_id
            combination.ubi_user_id = link?.ubi_user_id
            combination.campaign_global_id = link.campaign_global_id || ''
            combination.adw_id = link?.adw_id

            combination.domain = process.env.DOMAIN || ''
            console.log("linked combination", combination)
            await this.CombinationRepo.save(combination);

            return combination;
        }
        catch(err){
            return err
        }
    }

    async fillCombinations() {
        const channelService = container.resolve(ChannelService)
        const styleService = container.resolve(StyleService)

        const channelIds = await channelService.findAll();
        const styleIds = await styleService.findAll();
        const existedCombos = await this.CombinationRepo
            .createQueryBuilder('c')
            .select(['c.style_id', 'c.channel_id'])
            .getRawMany();

        const existedSet = new Set(
            existedCombos.map(c => `${c.style_id}_${c.channel_id}`)
        );

        const insertRows: Array<Partial<Combinations>> = [];

        for (const channel of channelIds) {
            for (const style of styleIds) {
                if (!existedSet.has(`${style.style_key}_${channel.id}`)) {
                    insertRows.push({ 
                        style_id: style.style_key, 
                        channel_id: channel.id, 
                        channel_key: channel.channel_key,
                        channel_value: channel.channel_value,
                        keyword_key: '78701918',
                        keyword_text: '-'
                    });
                }
            }
        }

        if (insertRows.length > 0) {
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

    async getUsedCombinations(){
        const json = Object.assign({});

        const used_combs = await this.CombinationRepo.find({
            where : {
                status: 'used'
            }
        })

        if(used_combs?.length){
            used_combs?.forEach((comb: Combinations, i: number) => {
                json[`${comb.channel_value}-${comb.style_id}`] = {
                    "channel_value": comb.channel_value,
                    "style_id": comb.style_id,
                    "offer": comb.channel_offer,
                    "subid": comb.subid,
                    "keyword_text": comb.keyword_text,
                    "keyword_key": comb.keyword_key,
                    "campaign_global_id": comb.campaign_global_id,
                    "adw_id": comb.adw_id
                }
            })
        }
        return json;
    }
}