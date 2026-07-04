import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';

import { User } from './user.model';
import { Brand } from './brand.model';
import { Category } from './category.model';

export type ProductDocument = HydratedDocument<Product>;

const buildSlug = (title: string): string => {
  return title ? slugify(title, { replacement: '-', trim: true, lower: true }) : '';
};

const schemaOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
};

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})

export class Product {
  @Prop({ 
    type: String, 
    required: true, 
    minlength: 3, 
    trim: true 
  })
  name: string;

  @Prop({
    type: String,
    default: function (this: Product) {
      return buildSlug(this.name);
    },
  })
  slug: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true, min: 0 }) // أضفنا min: 0 لمنع إدخال أسعار بالسالب
  price: number;

  @Prop({ type: Number, default: 0, min: 0 }) // أضفنا min: 0 لمنع المخزون بالسالب
  stock: number;

  @Prop({ type: Types.ObjectId, ref: Brand.name, required: false })
  brand?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: false })
  category?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  updatedBy?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const updateData = this.getUpdate() as UpdateQuery<ProductDocument>;

  if (updateData?.name) {
    updateData.slug = buildSlug(updateData.name as string);
  }
  
  next();
});

export const ProductFeature = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);