import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/decorators';
import { ValidRoles } from 'src/auth/interfaces/interfaces';


@Controller('seed')
export class SeedController {

  constructor( private readonly seedService: SeedService ) {}

 @Get()
 //@Auth( ValidRoles.superUser )
 executeSeed() {
  return this.seedService.runSeed()
 }
}
