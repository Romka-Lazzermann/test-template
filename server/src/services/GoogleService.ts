import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import axios from 'axios';
import { injectable } from 'tsyringe'

@injectable()
export class GoogleService {
    private api_key: string;
    private search_engine_id: string;
    private cache_dir: string;
    constructor() {
        this.api_key = process.env?.GOOGLE_API_KEY || "";
        this.search_engine_id = process.env?.SEARCH_ENGINE_ID || ""
        this.cache_dir = path.join(process.cwd(), 'public', 'cache', 'search');
    }
    async search(q: string) {

        const key = crypto.createHash('sha256').update(q).digest('hex');
        const cacheFile = path.join(this.cache_dir, key);

        try {
            await fs.mkdir(this.cache_dir, { recursive: true });

            const cacheExists = await fs.stat(cacheFile).then(() => true).catch(() => false);
            if (cacheExists) {
                const cachedData = await fs.readFile(cacheFile, 'utf-8');
                const parsed = JSON.parse(cachedData);
                return { ...parsed, cache: 1 };
            }

            const url = `https://www.googleapis.com/customsearch/v1`;
            const { data } = await axios.get(url, {
                params: {
                    q,
                    key: this.api_key,
                    cx: this.search_engine_id,
                },
            });
            console.log("show me waht yo got", data)
            if (Array.isArray(data.items) && data.items.length > 0) {
                await fs.writeFile(cacheFile, JSON.stringify(data));
            }

            return data;
        } catch (error) {
            console.error('Search error:', error);
            return { error: 'Search failed' };
        }
    }
}

