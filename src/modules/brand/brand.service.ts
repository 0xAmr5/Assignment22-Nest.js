import {Injectable,NotFoundException,ConflictException,Optional,Logger} from '@nestjs/common';
import BrandRepository from '../../DB/repository/brand.repository';
import { CreateBrandDto, UpdateBrandDto, BrandQueryDto } from './brand/brand.dto';

@Injectable()
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  constructor(
    private readonly brandRepository: BrandRepository,
    @Optional() private readonly s3Service?: any,
  ) {}

  private async resolveLogoUrl(file?: Express.Multer.File): Promise<string | undefined> {
    if (!file) return undefined;

    if (this.s3Service && typeof this.s3Service.uploadFile === 'function') {
      return await this.s3Service.uploadFile({ file, path: 'brands' });
    }

    return file.path || file.filename || undefined;
  }

  public async createBrand(
    payload: CreateBrandDto,
    file?: Express.Multer.File,
    currentUser?: { _id: string },
  ) {
    const { name } = payload;

    const isBrandExists = await this.brandRepository.findOne({ filter: { name } });
    if (isBrandExists) {
      throw new ConflictException(`Brand with name '${name}' already exists.`);
    }

    const uploadedLogoUrl = await this.resolveLogoUrl(file);

    const newBrand = await this.brandRepository.create({
      ...payload,
      logo: uploadedLogoUrl ?? payload.logo,
      createdBy: currentUser?._id,
    });

    return newBrand;
  }

  public async findAll(queryParams?: BrandQueryDto) {
    const page = Math.max(1, queryParams?.page || 1);
    const limit = Math.max(1, queryParams?.limit || 10);
    
    const filter: Record<string, any> = {};

    if (queryParams?.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { slogan: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    return this.brandRepository.paginate({ page, limit, filter });
  }

  public async findOne(brandId: string) {
    const brand = await this.brandRepository.findById(brandId);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found.`);
    }
    return brand;
  }

  public async update(
    brandId: string,
    payload: UpdateBrandDto,
    file?: Express.Multer.File,
    currentUser?: { _id: string },
  ) {
    const { name, slogan, logo } = payload;
    
    const existingBrand = await this.brandRepository.findOne({ filter: { _id: brandId } });
    if (!existingBrand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found.`);
    }

    if (name) {
      if (name === existingBrand.name) {
        throw new ConflictException('The new name must be different from the current name.');
      }
      
      const nameConflict = await this.brandRepository.findOne({ filter: { name } });
      if (nameConflict) {
        throw new ConflictException(`Brand with name '${name}' already exists.`);
      }
    }

    const uploadedLogoUrl = await this.resolveLogoUrl(file);

    const updateData = {
      ...(name && { name }),
      ...(slogan && { slogan }),
      ...(uploadedLogoUrl || logo ? { logo: uploadedLogoUrl ?? logo } : {}),
      updatedBy: currentUser?._id,
    };

    const updatedBrand = await this.brandRepository.findOneAndUpdate({
      filter: { _id: brandId },
      update: updateData,
    });

    if (!updatedBrand) {
      throw new NotFoundException(`Failed to update brand with ID ${brandId}.`);
    }

    return updatedBrand;
  }

  public async remove(brandId: string) {
    const isDeleted = await this.brandRepository.delete(brandId);
    if (!isDeleted) {
      throw new NotFoundException(`Brand with ID ${brandId} not found.`);
    }
    return { success: true, message: 'Brand successfully deleted.' };
  }
}