import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersServices: Partial<UsersService>

    beforeEach( async () => {
        //Create a fake copy of the users service
        const users: User[] = [];
         fakeUsersServices = {
            find: (email: string) => {
                const filterdUsers = users.filter((user) => user.email === email) 
                return Promise.resolve(filterdUsers);
            },
            create: (email: string, password: string) => {
               const user = {
                id: Math.floor(Math.random() * 999999),
                 email, 
                 password,
               } as User;
               users.push(user);
               return Promise.resolve(user);
            },
             
        };

        const module = await Test.createTestingModule ({
            providers: [ 
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersServices,
                },
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth services', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
       const user = await service.signup('asdf@asdf','asdf');

       expect(user.password).not.toEqual('asdf');
       const [salt, hash] = user.password.split('.');
       expect(salt).toBeDefined();
       expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async() => {
        await expect(
            service.signin('asdflk@lthe.com','dyfdgdhbfuf'),
        ).rejects.toThrow(NotFoundException);

    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('laskdjf@alskdfj.com', 'password');
        await expect(
          service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
        ).rejects.toThrow(BadRequestException);
    });

    it('return a user if correct password is provided', async () => {
      await service.signup('asdf@asdf.com','myasdf')

       const user = await service.signin('asdf@asdf.com', 'myasdf' );
       expect(user).toBeDefined();
    })


});

