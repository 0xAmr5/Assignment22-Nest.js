import {IsNotEmpty,IsString,Length,IsOptional,IsNumber,IsPositive,IsMongoId,Min} from 'class-validator';
import {Type} from 'class-transformer';
import {AtLeastOne} from '../../common/decorator/brand.decorator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 1000)
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0) 
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0) 
  stock?: number;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}

@AtLeastOne(['name', 'description', 'price', 'stock', 'brand', 'category', 'images'])
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 1000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty() 
  search?: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;
}