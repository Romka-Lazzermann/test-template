import { CronJob } from 'cron'
import { Impressions } from '../entity/ImpressionModel';
import { Combinations } from '../entity/CombinationModel';
import { container } from 'tsyringe';
import { In } from 'typeorm';

export const free_combinations_job = new CronJob(
    '*/30 * * * *',
    async () => {
        console.log('free_combinations_job started:', new Date().toISOString());
        const appDataSource: any = container.resolve('AppDataSource')

        try {
            const result: [] = await appDataSource.getRepository(Impressions)
                .createQueryBuilder('impression')
                .select('impression.combination_id', 'combination_id')
                .addSelect('COUNT(*)', 'c')
                .where((qb: { subQuery: () => { (): any; new(): any; select: { (arg0: string): { (): any; new(): any; from: { (arg0: typeof Combinations, arg1: string): { (): any; new(): any; where: { (arg0: string): { (): any; new(): any; andWhere: { (arg0: string, arg1: { used: string; }): { (): any; new(): any; getQuery: { (): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) => {
                    const subQuery = qb.subQuery()
                        .select('combination.id')
                        .from(Combinations, 'combination')
                        .where('combination.id = impression.combination_id')
                        .andWhere('combination.status = :used', { used: 'used' })
                        .getQuery();
                    return `EXISTS ${subQuery}`;
                })
                .andWhere('FROM_UNIXTIME(impression.time) > NOW() - INTERVAL 3 DAY')
                .andWhere('impression.status != :created', { created: 'created' })
                .groupBy('impression.combination_id')
                .getRawMany();

            if (result?.length) {
                const combinationIds = result.filter((res: any) => {
                    return Number(res?.c) < 5;
                }).map((r: any) => r.combination_id)
                console.log("combinationIds", combinationIds)

                const combinations_link_outdated = await appDataSource
                    .getRepository(Combinations)
                    .createQueryBuilder('combinations')
                    .select('combinations.id', 'id')
                    .where('combinations.id IN (:...ids)', { ids: combinationIds })
                    .andWhere((qb: { subQuery: () => { (): any; new(): any; select: { (arg0: string): { (): any; new(): any; from: { (arg0: string, arg1: string): { (): any; new(): any; where: { (arg0: string): { (): any; new(): any; andWhere: { (arg0: string): { (): any; new(): any; getQuery: { (): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) => {
                        const subQuery = qb.subQuery()
                            .select('links.id')
                            .from('links', 'links') 
                            .where('links.id = combinations.link_id')
                            .andWhere('FROM_UNIXTIME(links.time_create) < NOW() - INTERVAL 3 DAY')
                            .getQuery();
                        return `EXISTS ${subQuery}`;
                    })
                    .getRawMany();

                const combinations = await appDataSource
                    .getRepository(Combinations)
                    .findBy({ id: In(combinations_link_outdated) })

                for (const combination of combinations) {
                    combination.status = 'free'; 
                    combination.create_time = 0
                    combination.link_id = 0
                    combination.user_id = 0
                    combination.team_id = 0
                    combination.team_user_id = 0
                    combination.ubi_user_id = 0
                    combination.campaign_global_id = null
                    combination.adw_id = 0
                    combination.channel_offer = null
                }

                await appDataSource.getRepository(Combinations).save(combinations);
            }

        }
        catch (error) {
            console.error("err", error)
        }
    },
    null,
    false,
    'UTC'
);