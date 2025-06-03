import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from '../interfaces'
@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.ADMIN
    })
    role: UserRole

    @Column({type: "varchar", length: 100})
    login: string

    @Column({type: "varchar", length: 100})
    hash: string
}