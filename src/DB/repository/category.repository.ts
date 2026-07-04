import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDocument } from '../models/category.model';
import { BaseRepository } from './base.repository'; 

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryDocument> {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(
    @InjectModel(Category.name) 
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }


  // async findBySlug(slug: string): Promise<CategoryDocument | null> { ... }
}