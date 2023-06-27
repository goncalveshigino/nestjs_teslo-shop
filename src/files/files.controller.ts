import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import {FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { Response } from 'express';


import { fileNamer, fileFilter } from './helpers/helpers';


@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}


    @Get('product/:imageName')
    findProductImage(
      @Res() res: Response,
      @Param('imageName') imageName: string
    ){

      const path = this.filesService.getStaticProductImage( imageName );

      res.sendFile( path );
      
    }

   @Post('product')
   @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, 
    storage: diskStorage({
      destination: './static/products', 
      filename: fileNamer
    })
   }))

   uploadProductImage(
     @UploadedFile() file: Express.Multer.File
    ){
      
      if ( !file ) {
        throw new BadRequestException('Make sure that the file is an image');
      }

      const secureUrl = `${ file.fieldname }`

      return {
        secureUrl
      };
   }

}
