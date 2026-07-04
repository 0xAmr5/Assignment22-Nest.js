import {Body,Controller,Delete,Get,Param,Patch,Post,UploadedFiles,UseInterceptors,Query,ValidationPipe,UsePipes} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { multerCloud } from '../../common/utils/multer.utils';
import { Store_Enum } from '../../common/enum/multer.enum';
import { ProductService } from './product.service';
import { User } from '../../common/decorator/user.decorator';

import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductQueryDto 
} from './product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('attachments', 10, multerCloud({ store_type: Store_Enum.disk })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async createProduct(
    @Body() payload: CreateProductDto,
    @User() currentUser: any, 
    @UploadedFiles() attachments?: Express.Multer.File[], 
  ) {
    return this.productService.createProduct(payload, attachments, currentUser);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  public async getAllProducts(@Query() queryParams: ProductQueryDto) {
    return this.productService.findAll(queryParams);
  }

  @Get(':id')
  public async getProductById(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('attachments', 10, multerCloud({ store_type: Store_Enum.disk })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async updateProduct(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto,
    @User() currentUser: any,
    @UploadedFiles() attachments?: Express.Multer.File[],
  ) {
    return this.productService.update(id, payload, attachments, currentUser);
  }

  @Delete(':id')
  public async deleteProduct(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}