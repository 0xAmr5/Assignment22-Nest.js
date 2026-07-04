import {IsNotEmpty,IsString,Length,IsOptional,IsNumber,IsPositive} from 'class-validator';
import { Type } from 'class-transformer';
import { AtLeastOne } from '../../common/decorator/brand.decorator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  slogan: string;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  logo?: string;
}

@AtLeastOne(['name', 'slogan'])
export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  slogan?: string;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  logo?: string;
}

export class BrandQueryDto {
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