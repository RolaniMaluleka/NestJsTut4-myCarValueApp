import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; //RandomByte will generate random number that will encrypt our password, and scrypt is our actual hashing function
import { promisify } from "util"; //Ensure the use of promise
import { shareReplay } from "rxjs";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    static signup: any;
    static signin: any;
    constructor(private userService: UsersService){}

    async signup(email: string, password: string){
        //See if the email is in use
        const users = await this.userService.find(email);
        if(users.length){
            throw new BadRequestException('email is already use')
        }

        //Hash the user's password
        //Generate a salt 
        const salt = randomBytes(8).toString('hex');

        //Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        //Create a new user and save it 
        const user = await this.userService.create(email,result);


        //return the user
        return user
    }   

    async signin(email: string, password: string){
        const [user] = await this.userService.find(email)

        if(!user){
            throw new NotFoundException('User Not found')
        }

        //get back the seperated password into salt and the hash
        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;
        
        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Incorrect password');
        }
        return user;
        

    }


}

