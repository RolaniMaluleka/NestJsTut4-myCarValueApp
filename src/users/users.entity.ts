import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from "typeorm"; //Here we are importing decorators,these decorators are going to help our typeORM to understand some of the properties our entity is going to have.

//Hook ups Decorator inlude: AfterInsert, AfterUpdate, AfterRemove

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert(){
        console.log('Inserted user with id: ',this.id)
    }

    @AfterUpdate()
    logUpdate(){
        console.log('Updated user with id: ',this.id)
    }

    @AfterRemove()
    logRemove(){
        console.log('Removed user with id: ',this.id)
    }
}

