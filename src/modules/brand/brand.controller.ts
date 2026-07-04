import {Body,Controller,Delete,Get,Param,Patch,Post,UploadedFile,UseInterceptors,Query,ValidationPipe,UsePipes} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { multerCloud } from '../../common/utils/multer/multer.cloud';
import { Store_Enum } from '../../common/enum/multer.enum';
import { CreateBrandDto, UpdateBrandDto, QueryDto } from './brand.dto'; 
import { BrandService } from './brand.service'; 
import { User } from '../../common/decorator/user.decorator';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('attachment', multerCloud({ store_type: Store_Enum.disk })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async createBrand(
    @Body() payload: CreateBrandDto,
    @User() currentUser: any,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.brandService.createBrand(payload, attachment, currentUser);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  public async getAllBrands(@Query() queryParams: QueryDto) {
    return this.brandService.findAll(queryParams);
  }

  @Get(':id')
  public async getBrandById(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('attachment', multerCloud({ store_type: Store_Enum.disk })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async updateBrand(
    @Param('id') id: string,
    @Body() payload: UpdateBrandDto,
    @User() currentUser: any, 
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.brandService.updateBrand(id, payload, attachment, currentUser);
  }

  @Delete(':id')
  public async deleteBrand(@Param('id') id: string) {
    return this.brandService.removeBrand(id);
  }
}