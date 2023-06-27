import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import {FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';


@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

   @Post('product')
   @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, 
    storage: diskStorage({
      destination: './static/uploads'
    })
   }))

   uploadProductImage(
     @UploadedFile() file: Express.Multer.File
    ){
      
      if ( !file ) {
        throw new BadRequestException('Make sure that the file is an image');
      }

      return {
        fileName: file.originalname
      };
   }

}
