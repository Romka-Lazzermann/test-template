
import {DataSource} from 'typeorm'
import 'dotenv/config';
import path from 'path';
import {Blog} from './src/entity/BlogModel'
import {Category} from './src/entity/CategoryModel'
import {Channel} from './src/entity/ChannelModel'
import {Style} from './src/entity/StyleModel'
import {Combination} from './src/entity/CombinationModel'


export const AppDataSource = new DataSource({
    migrationsRun: true,
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "",
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    entities: [Blog, Category, Channel, Style, Combination],
    migrations: ["/src/migrations/*.ts"],
    synchronize: false
})