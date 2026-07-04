import {Injectable,NotFoundException,ConflictException,Optional,Logger} from '@nestjs/common';
import { ProductRepository } from '../../DB/repository/product.repository';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    @Optional() private readonly s3Service?: any,
  ) {}

  private async resolveImageUrls(files?: Express.Multer.File[]): Promise<string[]> {
    if (!files || !files.length) return [];

    const uploads = await Promise.all(
      files.map(async (file) => {
        if (this.s3Service && typeof this.s3Service.uploadFile === 'function') {
          return await this.s3Service.uploadFile({ file, path: 'products' });
        }
        return file.path || file.filename || '';
      }),
    );

    return uploads.filter(Boolean) as string[];
  }

  public async createProduct(
    payload: CreateProductDto,
    files?: Express.Multer.File[],
    currentUser?: { _id: string },
  ) {
    const { name } = payload;

    const isProductExists = await this.productRepository.findOne({ filter: { name } });
    if (isProductExists) {
      throw new ConflictException(`Product with name '${name}' already exists.`);
    }

    const uploadedImages = await this.resolveImageUrls(files);
    
    const finalImages = [...(payload.images ?? []), ...uploadedImages];

    const newProduct = await this.productRepository.create({
      ...payload,
      images: finalImages,
      createdBy: currentUser?._id,
    });

    return newProduct;
  }

  public async findAll(queryParams?: ProductQueryDto) {
    // حساب الصفحات بطريقة نظيفة
    const page = Math.max(1, queryParams?.page || 1);
    const limit = Math.max(1, queryParams?.limit || 10);

    const filter: Record<string, any> = {};

    if (queryParams?.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    if (queryParams?.brand) filter.brand = queryParams.brand;
    if (queryParams?.category) filter.category = queryParams.category;

    return this.productRepository.paginate({ page, limit, filter });
  }

  public async findOne(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    return product;
  }

  public async update(
    productId: string,
    payload: UpdateProductDto,
    files?: Express.Multer.File[],
    currentUser?: { _id: string },
  ) {
    const { name, description, price, stock, brand, category, images } = payload;

    const existingProduct = await this.productRepository.findOne({ filter: { _id: productId } });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (name) {
      if (name === existingProduct.name) {
        throw new ConflictException('The new name must be different from the current name.');
      }

      const nameConflict = await this.productRepository.findOne({ filter: { name } });
      if (nameConflict) {
        throw new ConflictException(`Product with name '${name}' already exists.`);
      }
    }

    const uploadedImages = await this.resolveImageUrls(files);

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price }),
      ...(stock !== undefined && { stock }),
      ...(brand && { brand }),
      ...(category && { category }),
      ...(images || uploadedImages.length > 0 ? { images: uploadedImages.length ? uploadedImages : images } : {}),
      updatedBy: currentUser?._id,
    };

    const updatedProduct = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: updateData,
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Failed to update product with ID ${productId}.`);
    }

    return updatedProduct;
  }

  public async remove(productId: string) {
    const isDeleted = await this.productRepository.delete(productId);
    if (!isDeleted) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    return { success: true, message: 'Product successfully deleted.' };
  }
}