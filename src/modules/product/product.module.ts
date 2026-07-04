import { Module } from '@nestjs/common';

import { ProductFeature } from '../../DB/model/product.model';

import { ProductRepository } from '../../DB/repository/product.repository';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    ProductFeature, 
  ],
  controllers: [
    ProductController,
  ],
  providers: [
    ProductRepository,
    ProductService,
  ],
  exports: [
    ProductRepository,
    ProductService, 
  ],
})
export class ProductModule {}