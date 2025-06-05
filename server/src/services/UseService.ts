import { Repository, DataSource } from "typeorm";
import { Users } from '../entity/UserModel'
import { UserRole, LoginCredentials } from '../interfaces'
import { injectable, inject } from 'tsyringe';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
@injectable()
export class UserService {
    protected UserRepo: Repository<Users>;

    constructor(@inject('UserDbDataSource') private datasource: DataSource) {
        this.UserRepo = datasource.getRepository(Users);
    }

    async createUser(userData: Partial<Users>) {
        const { login, hash } = userData;
        let hashedPassword : string | null = null;
        if (hash) {
            hashedPassword = await bcrypt.hash(hash, 10);
        }

        if (login && hashedPassword) {
            const user: Partial<Users> = {
                login: login,
                hash: hashedPassword,
                role: UserRole.ADMIN
            }
            const newUser = await this.UserRepo.create(user)
            await this.UserRepo.save(newUser);
            if(newUser){
                return {
                    success: 1,
                    message: "User successfully created ."
                }
            }
        }

    }
    async findUser(userData: Partial<Users>){
        const { login, id } = userData;
        if(login && id){
            const _user = await this.UserRepo.findOneBy({
                id,
                login
            })
            return _user
        }else {
            return null
        }
    }
    async compareUser(userData: Partial<Users>) {
        const { login } = userData;
        const user = await this.UserRepo.findBy({
            login: login
        })

        if (user?.length) {
            return 1
        } else {
            return 0
        }
    }

    async loginUser(userCredentials : LoginCredentials){
        const {login, password} = userCredentials;

        const user = await this.UserRepo.findOneBy({ login });
        if (!user){
            return { success: 0, error: 'Invalid login' };
        } 

        const valid = await bcrypt.compare(password, user.hash);
        if (!valid){
            return  { success: 0, error: 'Invalid password' };
        } 

        const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, {
            expiresIn: '1h',
        });

        return { success: 1,  token };
    }

}