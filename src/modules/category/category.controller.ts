import {Body,Controller,Delete,Get,Param,Patch,Post,UploadedFile,UseInterceptors,Query,ValidationPipe,UsePipes} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { multerCloud } from '../../common/utils/multer/multer.cloud';
import { Store_Enum } from '../../common/enum/multer.enum';
import { CategoryService } from './category.service'; 
import { User } from '../../common/decorator/user.decorator';

import { 
  CreateCategoryDto, 
  UpdateCategoryDto, 
  CategoryQueryDto 
} from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('attachment', multerCloud({ store_type: Store_Enum.disk })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async createCategory(
    @Body() payload: CreateCategoryDto,
    @User() currentUser: any, 
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.categoryService.createCategory(payload, attachment, currentUser);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  public async getAllCategories(@Query() queryParams: CategoryQueryDto) {
    return this.categoryService.findAll(queryParams);
  }

  @Get(':id')
  public async getCategoryById(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('attachment', multerCloud({ store_type: Store_Enum.disk })),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async updateCategory(
    @Param('id') id: string,
    @Body() payload: UpdateCategoryDto,
    @User() currentUser: any,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.categoryService.update(id, payload, attachment, currentUser);
  }

  @Delete(':id')
  public async deleteCategory(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}