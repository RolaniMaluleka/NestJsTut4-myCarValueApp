import { 
    Controller,
    Post, 
    Body, 
    Param, 
    Get, 
    Patch, 
    Delete, 
    NotFoundException, 
    BadRequestException, 
    Query,
    UseInterceptors,
    ClassSerializerInterceptor 
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto) //This is to hide password in the response after a request has been made
export class UsersController {

    constructor(private userService: UsersService){}

    @Post('/signup')
     createUser(@Body() body: CreateUserDto) {
       this.userService.create(body.email, body.password);
    }

    // @Serialize(UserDto)//This is to hide password in the response after a request has been made
    @Get('/:id')
    async findUser(@Param('id') id: string){
       
        const user = await this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user; 
    }

    // @Serialize(UserDto)//This is to hide password in the response after a request has been made
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
