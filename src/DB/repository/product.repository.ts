import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product, ProductDocument } from '../models/product.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(
    @InjectModel(Product.name) 
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  
  // async findProductsByPriceRange(min: number, max: number): Promise<ProductDocument[]> { ... }
}