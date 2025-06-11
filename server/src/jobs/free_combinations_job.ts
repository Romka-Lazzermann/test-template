import { CronJob } from 'cron'


export const free_combinations_job = new CronJob(
    // every 30 minutes
    '*/30 * * * *',
    async () => {
        console.log('free_combinations_job started:', new Date().toISOString());

        try {
        } catch (error) {
        }
    },
    null,
    true,
    'UTC'
);