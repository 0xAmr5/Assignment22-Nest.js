import {Injectable,NotFoundException,ConflictException,Optional,Logger} from '@nestjs/common';

import { CategoryRepository } from '../../DB/repository/category.repository';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from './category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Optional() private readonly s3Service?: any,
  ) {}

  private async resolveImageUrl(file?: Express.Multer.File): Promise<string | undefined> {
    if (!file) return undefined;

    if (this.s3Service && typeof this.s3Service.uploadFile === 'function') {
      return await this.s3Service.uploadFile({ file, path: 'categories' });
    }

    return file.path || file.filename || undefined;
  }

  public async createCategory(
    payload: CreateCategoryDto,
    file?: Express.Multer.File,
    currentUser?: { _id: string },
  ) {
    const { name } = payload;

    const isCategoryExists = await this.categoryRepository.findOne({ filter: { name } });
    if (isCategoryExists) {
      throw new ConflictException(`Category with name '${name}' already exists.`);
    }

    const uploadedImageUrl = await this.resolveImageUrl(file);

    const newCategory = await this.categoryRepository.create({
      ...payload,
      image: uploadedImageUrl ?? payload.image,
      createdBy: currentUser?._id,
    });

    return newCategory;
  }

  public async findAll(queryParams?: CategoryQueryDto) {
    const page = Math.max(1, queryParams?.page || 1);
    const limit = Math.max(1, queryParams?.limit || 10);

    const filter: Record<string, any> = {};

    if (queryParams?.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } }
      ];
    }

    return this.categoryRepository.find({ filter, page, limit });
  }

  public async findOne(categoryId: string) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }
    return category;
  }

  public async update(
    categoryId: string,
    payload: UpdateCategoryDto,
    file?: Express.Multer.File,
    currentUser?: { _id: string },
  ) {
    const { name, image } = payload;
    
    const existingCategory = await this.categoryRepository.findOne({ filter: { _id: categoryId } });
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    if (name) {
      if (name === existingCategory.name) {
        throw new ConflictException('The new name must be different from the current name.');
      }

      const nameConflict = await this.categoryRepository.findOne({ filter: { name } });
      if (nameConflict) {
        throw new ConflictException(`Category with name '${name}' already exists.`);
      }
    }

    const uploadedImageUrl = await this.resolveImageUrl(file);

    const updateData = {
      ...(name && { name }),
      ...(uploadedImageUrl || image ? { image: uploadedImageUrl ?? image } : {}),
      updatedBy: currentUser?._id,
    };

    const updatedCategory = await this.categoryRepository.findOneAndUpdate({
      filter: { _id: categoryId },
      update: updateData,
    });

    if (!updatedCategory) {
      throw new NotFoundException(`Failed to update category with ID ${categoryId}.`);
    }

    return updatedCategory;
  }

  public async remove(categoryId: string) {
    const isDeleted = await this.categoryRepository.delete(categoryId);
    if (!isDeleted) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }
    return { success: true, message: 'Category successfully deleted.' };
  }
}