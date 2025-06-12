import { CronJob } from 'cron';
import { Impressions } from '../entity/ImpressionModel';
import { container } from 'tsyringe';
import { createHash } from 'crypto';
import axios from 'axios';

function hashSha256(str: string) {
  return createHash('sha256').update(str).digest('hex');
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const post_back_job = new CronJob(
  '* * * * *',
  async () => {
    console.log('post_back_job started:', new Date().toISOString());
    try {
      const appDataSource: any = container.resolve('AppDataSource');
      const impressionRepo = appDataSource.getRepository(Impressions);

      const clicked = await impressionRepo.find({
        where: { status: 'clicked' },
        relations: ['link'],
      });

      const requests = clicked.map((i: Impressions) => {
        const pixel_id = i.link.pixel_id;
        const pixel_token = i.link.pixel_token;
        const postbackType = i.link.postback;
        let url = '';
        let payload: any = {};
        const headers: any = {
          'Content-Type': 'application/json',
        };

        if (postbackType === 'facebook') {
          url = `https://graph.facebook.com/v18.0/${pixel_id}/events`;
          payload = {
            access_token: pixel_token,
            data: [{
              action_source: 'website',
              event_name: capitalize(i.link.pixel_event || ''),
              event_time: Math.floor(Date.now() / 1000),
              user_data: {
                client_ip_address: i.ip,
                client_user_agent: i.ua,
                em: hashSha256(`search${i.id}`),
                fbp: `fb.1.${Date.now()}.${Math.floor(Math.random() * 9999)}`,
                fbc: `fb.1.${Date.now()}.${i.fbclid}`,
              },
            }],
          };
        } else if (postbackType === 'tiktok') {
          url = 'https://business-api.tiktok.com/open_api/v1.2/pixel/track/';
          payload = {
            pixel_code: pixel_id,
            event: i.link.pixel_event,
            timestamp: new Date().toISOString(),
            context: {
              user: {
                email: hashSha256(`search${i.id}`),
              },
              user_agent: i.ua,
              ip: i.ip,
              ad: {
                callback: i.ttclid,
              },
            },
          };
          headers['Access-Token'] = pixel_token;
        } else {
          console.warn(`Unsupported postback type: ${postbackType}`);
          return Promise.resolve();
        }

        return axios.post(url, payload, { headers })
          .then(async () => {
            i.status = 'sent';
            await impressionRepo.save(i);
            console.log(`Impression ${i.id} sent and updated`);
          })
          .catch(err => {
            console.error(`Error sending impression ${i.id} ${url}`, err.response?.data || err.message);
          });
      });

      await Promise.all(requests);
      console.log('All requests finished');
    } catch (error) {
      console.error('Cron job error:', error);
    }
  },
  null,
  true,
  'UTC'
);