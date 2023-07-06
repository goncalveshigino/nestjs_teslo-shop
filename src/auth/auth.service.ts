import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto/dto';


@Injectable()
export class AuthService {


  constructor( 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
   ){}



  async create(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData, 
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save( user )
      delete user.password;

      return user;

    } catch (error) {
      this.handleDBErrors( error )
    }

  }


  async login( loginUserDto:LoginUserDto ) {

        
        const { password, email } = loginUserDto;

        const user = await this.userRepository.findOne({
          where: { email }, 
          select: { email: true, password: true }
        });

        if ( !user )
            throw new UnauthorizedException('Credentials are not valid');

        if ( !bcrypt.compareSync( password, user.password ))
            throw new UnauthorizedException('Credentials are not valid');

        return user;

        //TODO: retornar o JWT

  }

  private handleDBErrors( error: any ): never {

    if ( error.code === '23505' )
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');
  }

 
}
