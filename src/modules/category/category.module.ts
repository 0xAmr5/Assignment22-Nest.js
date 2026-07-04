import { Module } from '@nestjs/common';

import { CategoryFeature } from '../../DB/model/category.model';

import { CategoryRepository } from '../../DB/repository/category.repository';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    CategoryFeature,    
  ],
  controllers: [
    CategoryController,
  ],
  providers: [
    CategoryRepository,
    CategoryService,
  ],
  exports: [
    CategoryRepository,
    CategoryService, 
  ],
})
export class CategoryModule {}