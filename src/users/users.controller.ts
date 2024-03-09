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
    ClassSerializerInterceptor,
    Session 
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';

@Controller('auth')
@Serialize(UserDto) //This is to hide password in the response after a request has been made
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ){}

    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any){
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any){
    //     return session.color
    // }

    // @Get('/whoami')
    // whoAmI(@Session() session: any){
    //     return this.userService.findOne(session.userId);
    // }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: string){
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any){
        session.userId = null;
    }


    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
      const user = await this.authService.signup(body.email, body.password);
      session.userId = user.id;
      return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
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
