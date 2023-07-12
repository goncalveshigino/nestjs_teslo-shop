import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';

import { AuthModule } from '../auth/auth.module';

import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';


import { Product, ProductImage } from './entities/entity';



@Module({
  controllers: [ProductsController],
  providers: [ProductsService], 
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]), 
    AuthModule
  ], 
  exports: [
    ProductsService, 
    TypeOrmModule
  ]
})
export class ProductsModule {}
