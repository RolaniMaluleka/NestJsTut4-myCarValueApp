import { Controller, Post, Body, Param, Get, Patch, Delete, NotAcceptableException, BadRequestException, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {

    constructor(private userService: UsersService){}

    @Post('/signup')
     createUser(@Body() body: CreateUserDto) {
       this.userService.create(body.email, body.password);
    }

    @Get('/:id')
    findUser(@Param('id') id: string){
        return this.userService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.find(email);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: number){
        return this.userService.remove(id)
    }


}
