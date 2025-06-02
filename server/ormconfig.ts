
import {DataSource} from 'typeorm'
import dotenv from 'dotenv'
import path from 'path';
import {Blog} from './src/entity/BlogModel'
import {Category} from './src/entity/CategoryModel'
import {Channel} from './src/entity/ChannelModel'
import {Style} from './src/entity/StyleModel'
import {Combination} from './src/entity/CombinationModel'


const credentials = dotenv.config({ path: path.resolve(__dirname, './.env') });
console.log("credentials", credentials)
// console.log("dirname", __dirname + "\\\src\\\entity\\\*.ts")
// console.log("dirname", __dirname + "\\\src\\\migrations\\\*.ts")

export const AppDataSource = new DataSource({
    migrationsRun: true,
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 3306),
    username: credentials?.parsed?.DB_USER || process.env.DB_USER,
    password: credentials?.parsed?.DB_PASS || process.env.DB_PASSWORD,
    database: credentials?.parsed?.DB_NAME || process.env.DB_NAME,
    entities: [Blog, Category, Channel, Style, Combination],
    migrations: ["/src/migrations/*.ts"],
    synchronize: false
})