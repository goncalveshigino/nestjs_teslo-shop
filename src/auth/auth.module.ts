import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService], 
  imports: [
    TypeOrmModule.forFeature([ User ]), 

    PassportModule.register({ defaultStrategy: 'jwt'}),


    JwtModule.registerAsync({
      imports: [ ConfigModule], 
      inject: [ ConfigService], 
      useFactory: ( configService: ConfigService ) => {
       
        return {
          secret: configService.get('JWT_SECRET'), 
            signOptions: {
              expiresIn:'2h'
          }
        }
      }
    })

 
  ], 
  exports: [ TypeOrmModule ]
})
export class AuthModule {}
