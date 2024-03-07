import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";


@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async signup(email: string, password: string){
        //See if the email is in use
        const users = await this.userService.find(email);
        if(users.length){
            throw new BadRequestException
        }

        //Hash the user's password

        //Create a new user and save it 

        //return the user
    }

    signin(){

    }


}

