import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"; //Here we are importing decorators,these decorators are going to help our typeORM to understand some of the properties our entity is going to have.



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
}

