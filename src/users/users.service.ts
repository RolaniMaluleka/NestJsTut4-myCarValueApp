import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    //repos are responsible for creating an entity

    create( email: string, password: string) {
        const user = this.repo.create({email, password}); //this is for creating an instance of our entity
        return this.repo.save(user);
    }

    findOne(id: number){
        if(!id){
            return null;
        }

        return this.repo.findOneBy({id});
    }

    find(email: string) {
        return this.repo.find({where: { email }})
    }

    async update(id: number, attributes: Partial<User>){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User you are trying to update is not found');
        }
        Object.assign(user, attributes);
        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User you are trying to delete not found');
        }
        return this.repo.remove(user);
    }
}
