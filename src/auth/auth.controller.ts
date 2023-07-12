import { Controller, Get, Post, Body, UseGuards, Req , Headers, SetMetadata} from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto,LoginUserDto } from './dto/dto';
import { AuthGuard } from '@nestjs/passport';

import { RawHeaders, GetUser } from './decorators/decorators';


import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';






@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {

   console.log(request)

    return {
      ok: true, 
      message: 'Hello world private',
      user, 
      userEmail, 
      rawHeaders, 
      headers
    }

  }

  //@SetMetadata('roles',['admin','super-user'])
  @Get('private2')

  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){


    return {
      ok: true, 
      user
    }
  }

}
