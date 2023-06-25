import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {


  constructor(
    private readonly productsService: ProductsService
  ){}
  
async runSeed() {

  await this.insertNewProducts();

  return 'SEED EXECUTED'

}

private async insertNewProducts() {
  await this.productsService.deleteAllProducts();
  return true;
}

}
