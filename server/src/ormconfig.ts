
import {DataSource} from 'typeorm'
import dotenv from 'dotenv'
import {Blog} from './entity/BlogModel'
import {Category} from './entity/CategoryModel'
import {Channel} from './entity/ChannelModel'
import {Style} from './entity/StyleModel'
import {Combinations} from './entity/CombinationModel'
import { Links } from './entity/LinkModel'
import { LinksMultilang } from './entity/LinksMultilang'
dotenv.config();

export const AppDataSource = new DataSource({
    migrationsRun: true,
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "",
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    entities: [Blog, Category, Channel, Style, Combinations, Links, LinksMultilang],
    migrations: ["/src/migrations/*.ts"],
    synchronize: false
})