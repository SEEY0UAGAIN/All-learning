import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import "reflect-metadata";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    age?: number;

    @Column({ default: "user" }) 
    role!: string; 
}
