import { Module } from '@nestjs/common';

import { BrandFeatureDefinition } from '../../DB/model/brand.model';

import { BrandRepository } from '../../DB/repository/brand.repository';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [
    BrandFeatureDefinition, 
  ],
  controllers: [
    BrandController,
  ],
  providers: [
    BrandRepository,
    BrandService,
  ],
  exports: [
    BrandRepository,
    BrandService, 
  ],
})
export class BrandModule {}