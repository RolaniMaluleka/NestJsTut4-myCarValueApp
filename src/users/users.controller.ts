import { Controller, Post, Body, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        console.log(body);

        if(!body){
            throw new NotAcceptableException('Email and password are of type string');
        }
    }

}
