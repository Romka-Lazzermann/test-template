
import 'dotenv/config';
import {DataSource} from 'typeorm'
import {Users} from './src/entity/UserModel'
 
export const UserDbDataSource = new DataSource({
    migrationsRun: true,
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_ACCESS_PORT || 3306),
    username: process.env.DB_ACCESS_USER || process.env.DB_ACCESS_USER,
    password: process.env.DB_ACCESS_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DB_ACCESS_NAME || process.env.DB_ACCESS_NAME,
    entities: [Users],
    migrations: ['src/migrations/user_db/*.ts'],
    synchronize: false
})