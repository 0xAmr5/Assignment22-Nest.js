import {IsNotEmpty,IsString,Length,IsOptional,IsNumber,IsPositive} from 'class-validator';
import {Type} from 'class-transformer';
import { AtLeastOne } from '../../common/decorator/brand.decorator'; 

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  image?: string;
}

@AtLeastOne(['name']) 
export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  image?: string;
}

export class CategoryQueryDto {
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
}