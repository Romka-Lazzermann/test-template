import { CronJob } from 'cron'

export const post_back_job = new CronJob(
    '* * * * *',
    async () => {
        console.log('post_back_job started:', new Date().toISOString());

        try {
        } catch (error) {
        }
    },
    null,
    true, 
    'UTC' 
);