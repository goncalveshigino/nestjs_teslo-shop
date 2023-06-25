
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product, ProductImage } from './entities/entity';
import { validate as isUUID } from 'uuid'


@Injectable()
export class ProductsService {

  private logger = new Logger('ProductService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>

  ){}

 async  create(createProductDto: CreateProductDto) {
   
    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails, 
        images: images.map( image =>  this.productImageRepository.create({ url: image }) )
      });

      await this.productRepository.save( product );

      return {...product, images};
      
    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  // TODO: paginar
  async findAll( paginationDto: PaginationDto) { 

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({

     take: limit, 
     skip: offset,
     relations: {
       images: true,
     }
    })

    return products.map( product => ({
      ...product, 
      images: product.images.map( img => img.url )
    }))

  }


  async findOne( term: string ) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product =  await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(), 
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }


    if ( !product )
       throw new NotFoundException(`Product with id ${ term } not found`);

    return product;

  }

  async findOnePlain( term: string ) {
    const { images = [], ...product } = await this.findOne( term );
    return {
      ...product, 
      images: images.map( image => image.url )
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const product = await this.productRepository.preload({
       id: id, 
       ...updateProductDto, 
       images: [],
    });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } no found`);

    try {

      await this.productRepository.save( product );
      return product;

    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  async remove( id: string ) {
    const product = await this.findOne( id );

    await this.productRepository.remove( product )
  }

  private handleDBExceptions( error: any ) {

    if (error.code === '23505' )
      throw new BadRequestException(error.detal);
      
    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
  
}
