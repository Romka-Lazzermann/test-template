"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const credentials = dotenv_1.default.config({ path: path_1.default.resolve(__dirname, './.env') });
console.log("credentials", credentials);
console.log("dirname", __dirname + "\\\src\\\entity\\\*.ts");
console.log("dirname", __dirname + "\\\src\\\migrations\\\*.ts");
exports.AppDataSource = new typeorm_1.DataSource({
    migrationsRun: true,
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 3306),
    username: credentials?.parsed?.DB_USER || process.env.DB_USER,
    password: credentials?.parsed?.DB_PASS || process.env.DB_PASSWORD,
    database: credentials?.parsed?.DB_NAME || process.env.DB_NAME,
    entities: ["/src/entity/*.ts"],
    migrations: ["/src/migrations/*.ts"],
    synchronize: false
});
